'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';

// ── FPS camera controller ──────────────────────────────────────────────────

const MOVE_SPEED = 0.05;
const LOOK_SENSITIVITY = 0.003;
const TOUCH_LOOK_SENSITIVITY = 0.015;

interface JoystickState {
  active: boolean;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
}

// Shared joystick state (move + look)
const moveJoy = { dx: 0, dy: 0 };
const lookJoy = { dx: 0, dy: 0 };

export function WalkCameraController() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize yaw/pitch from current camera orientation
    // to prevent flip when switching from orbit to walk mode
    yaw.current = camera.rotation.y;
    // Clamp pitch to avoid flipping (normalization via atan2 can give -PI to PI)
    pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, camera.rotation.x));

    const onKey = (e: KeyboardEvent) => {
      keys.current[e.code] = e.type === 'keydown';
    };

    const onMouseDown = (e: MouseEvent) => {
      // Only right-click or middle-click for look (left is for UI)
      if (e.button === 0) {
        isDragging.current = true;
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onMouseUp = () => { isDragging.current = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastMouse.current.x;
      const dy = e.clientY - lastMouse.current.y;
      lastMouse.current = { x: e.clientX, y: e.clientY };
      yaw.current -= dx * LOOK_SENSITIVITY;
      pitch.current -= dy * LOOK_SENSITIVITY;
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current));
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  useFrame(() => {
    // Apply look joystick
    if (lookJoy.dx !== 0 || lookJoy.dy !== 0) {
      yaw.current -= lookJoy.dx * TOUCH_LOOK_SENSITIVITY;
      pitch.current -= lookJoy.dy * TOUCH_LOOK_SENSITIVITY;
      pitch.current = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, pitch.current));
    }

    // Apply rotation
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw.current;
    camera.rotation.x = pitch.current;

    // Movement direction
    const forward = new Vector3(0, 0, -1).applyEuler(new Euler(0, yaw.current, 0));
    const right = new Vector3(1, 0, 0).applyEuler(new Euler(0, yaw.current, 0));

    const k = keys.current;
    let moved = false;

    if (k['KeyW'] || k['ArrowUp']) { camera.position.addScaledVector(forward, MOVE_SPEED); moved = true; }
    if (k['KeyS'] || k['ArrowDown']) { camera.position.addScaledVector(forward, -MOVE_SPEED); moved = true; }
    if (k['KeyA'] || k['ArrowLeft']) { camera.position.addScaledVector(right, -MOVE_SPEED); moved = true; }
    if (k['KeyD'] || k['ArrowRight']) { camera.position.addScaledVector(right, MOVE_SPEED); moved = true; }

    // Move joystick
    if (moveJoy.dx !== 0 || moveJoy.dy !== 0) {
      camera.position.addScaledVector(right, moveJoy.dx * MOVE_SPEED);
      camera.position.addScaledVector(forward, -moveJoy.dy * MOVE_SPEED);
      moved = true;
    }

    void moved;
  });

  return null;
}

// ── Liquid Glass Joystick ──────────────────────────────────────────────────

const JOYSTICK_RADIUS = 36;
const KNOB_RADIUS = 15;

function Joystick({
  side,
  onMove,
}: {
  side: 'left' | 'right';
  onMove: (dx: number, dy: number) => void;
}) {
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const joy = useRef<JoystickState>({ active: false, startX: 0, startY: 0, dx: 0, dy: 0 });
  const baseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;

    const onStart = (cx: number, cy: number) => {
      joy.current = { active: true, startX: cx, startY: cy, dx: 0, dy: 0 };
    };
    const onMove_ = (cx: number, cy: number) => {
      if (!joy.current.active) return;
      let dx = cx - joy.current.startX;
      let dy = cy - joy.current.startY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > JOYSTICK_RADIUS) {
        dx = (dx / dist) * JOYSTICK_RADIUS;
        dy = (dy / dist) * JOYSTICK_RADIUS;
      }
      joy.current.dx = dx / JOYSTICK_RADIUS;
      joy.current.dy = dy / JOYSTICK_RADIUS;
      setKnob({ x: dx, y: dy });
      onMove(joy.current.dx, joy.current.dy);
    };
    const onEnd = () => {
      joy.current = { active: false, startX: 0, startY: 0, dx: 0, dy: 0 };
      setKnob({ x: 0, y: 0 });
      onMove(0, 0);
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      onStart(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      onMove_(t.clientX, t.clientY);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchcancel', onEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
    };
  }, [onMove]);

  const size = JOYSTICK_RADIUS * 2 + 8;

  return (
    <div
      ref={baseRef}
      style={{
        position: 'absolute',
        bottom: 40,
        [side]: 40,
        width: size,
        height: size,
        borderRadius: '50%',
        // iOS liquid glass
        background: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Knob */}
      <div
        style={{
          position: 'absolute',
          width: KNOB_RADIUS * 2,
          height: KNOB_RADIUS * 2,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.35)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.6)',
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: joy.current.active ? 'none' : 'transform 0.15s ease-out',
          pointerEvents: 'none',
        }}
      />
      {/* Label */}
      <span style={{
        position: 'absolute',
        bottom: 6,
        fontSize: 9,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 1,
        textTransform: 'uppercase',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {side === 'left' ? 'move' : 'look'}
      </span>
    </div>
  );
}

export function WalkJoystick() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const check = () => setIsTouch(true);
    window.addEventListener('touchstart', check, { once: true });
    return () => window.removeEventListener('touchstart', check);
  }, []);

  if (!isTouch) return null;

  return (
    <>
      <Joystick
        side="left"
        onMove={(dx, dy) => { moveJoy.dx = dx; moveJoy.dy = dy; }}
      />
      <Joystick
        side="right"
        onMove={(dx, dy) => { lookJoy.dx = dx; lookJoy.dy = dy; }}
      />
    </>
  );
}
