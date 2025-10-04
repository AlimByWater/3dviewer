import { Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import './DotButton.css';
import { Vector3 } from '@/types/types';
import { useRouter } from 'next/navigation';
import { isLink } from '@/utils/isLink';

interface DotButtonProps {
  position?: Vector3;
  targetUrl?: string;
  svgIcon?: string;
  scale?: number;
  modelRef?: React.RefObject<THREE.Object3D>;
}

const DotButton = ({
  position,
  targetUrl,
  svgIcon,
  scale = 1,
  modelRef,
}: DotButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [occlusionOpacity, setOcclusionOpacity] = useState(1); // Новое состояние для окклюзии
  const [computedPosition, setComputedPosition] = useState<Vector3>(
    position || [5, -3, 0],
  );
  const [debugRay, setDebugRay] = useState<{
    start: THREE.Vector3;
    end: THREE.Vector3;
  } | null>(null);
  const groupRef = useRef<THREE.Group>(null);
  const raycaster = useRef(new THREE.Raycaster());
  const checkInterval = useRef(0); // Для оптимизации проверок
  const { camera } = useThree();

  // Флаг для включения/выключения отладки (можно вынести в props)
  const DEBUG_RAYCASTING = false;

  // Вычисляем позицию на основе bounding box модели
  useEffect(() => {
    if (position) {
      setComputedPosition(position);
      // console.log('Using provided position:', position);
    } else if (modelRef?.current) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const topPosition: [number, number, number] = [
        (box.min.x + box.max.x) / 2,
        box.max.y + 0.5, // Увеличено расстояние над моделью
        (box.min.z + box.max.z) / 2,
      ];
      setComputedPosition(topPosition);
      // console.log('Button position calculated:', topPosition);
      // console.log('Model bounds:', box);
    }
  }, [modelRef, position]);

  // Анимация и проверка видимости
  useFrame((state) => {
    if (groupRef.current) {
      // Billboard эффект - кнопка всегда смотрит на камеру
      groupRef.current.lookAt(camera.position);

      // Получаем мировую позицию кнопки
      const buttonWorldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(buttonWorldPos);

      // Проверка окклюзии с помощью raycasting (оптимизировано - не каждый кадр)
      checkInterval.current += state.clock.getDelta();
      if (checkInterval.current > 0.05 && modelRef?.current) {
        // Проверка 20 раз в секунду
        checkInterval.current = 0;

        // Создаем луч от камеры к кнопке
        const direction = buttonWorldPos
          .clone()
          .sub(camera.position)
          .normalize();
        raycaster.current.set(camera.position, direction);

        // Расстояние от камеры до кнопки
        const distanceToButton = camera.position.distanceTo(buttonWorldPos);

        // Проверяем пересечения с моделью
        const intersects = raycaster.current.intersectObject(
          modelRef.current,
          true,
        );

        // Кнопка скрыта, если есть пересечение ближе, чем сама кнопка
        const isOccluded =
          intersects.length > 0 &&
          intersects[0].distance < distanceToButton - 0.1; // Небольшой отступ

        // Плавное изменение прозрачности окклюзии
        const targetOcclusionOpacity = isOccluded ? 0 : 1;
        setOcclusionOpacity((prev) =>
          THREE.MathUtils.lerp(prev, targetOcclusionOpacity, 0.15),
        );

        // Сохраняем данные для отладочной визуализации
        if (DEBUG_RAYCASTING) {
          const rayEnd = camera.position
            .clone()
            .add(direction.multiplyScalar(distanceToButton));
          setDebugRay({ start: camera.position.clone(), end: rayEnd });
        }
      }

      // Вычисляем угол между камерой и кнопкой для угловой видимости
      const cameraDirection = camera.position
        .clone()
        .sub(buttonWorldPos)
        .normalize();
      const upVector = new THREE.Vector3(0, 1, 0);
      const angle = cameraDirection.angleTo(upVector);

      // Показываем кнопку только под определенными углами
      const targetOpacity =
        angle > Math.PI / 4 && angle < (Math.PI * 3) / 4 ? 1 : 0;

      // Плавное изменение прозрачности
      setOpacity((prev) => THREE.MathUtils.lerp(prev, targetOpacity, 0.1));
      setVisible(opacity > 0.01 || occlusionOpacity > 0.01);

      // Плавное вращение при hover
      if (hovered) {
        groupRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 2) * 0.1;
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          0,
          0.1,
        );
      }

      // Плавное изменение масштаба при hover
      const targetScale = hovered ? 1.2 : 1.0;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  const router = useRouter();

  const handleClick = () => {
    if (targetUrl) {
      if (targetUrl[0] === '/') {
        router.push(`?shortCode=${targetUrl.substring(1)}`);
      } else {
        const url = isLink(targetUrl) ? targetUrl : `https://${targetUrl}`;
        window.open(url, '_blank');
      }
    }
  };

  // Скрываем компонент если он полностью прозрачен или явно скрыт
  if (!visible) return null;

  return (
    <group ref={groupRef} position={computedPosition}>
      {/* Отладочная визуализация луча */}
      {DEBUG_RAYCASTING && debugRay && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={
                new Float32Array([
                  debugRay.start.x,
                  debugRay.start.y,
                  debugRay.start.z,
                  debugRay.end.x,
                  debugRay.end.y,
                  debugRay.end.z,
                ])
              }
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color={occlusionOpacity < 0.5 ? 'red' : 'green'}
            linewidth={2}
          />
        </line>
      )}

      {/* Отладочная сфера в точке пересечения */}
      {DEBUG_RAYCASTING && occlusionOpacity < 0.5 && (
        <mesh position={computedPosition}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" transparent opacity={0.5} />
        </mesh>
      )}

      <Html
        center
        distanceFactor={10}
        style={{
          cursor: hovered && occlusionOpacity > 0.5 ? 'pointer' : 'auto',
          userSelect: 'none',
          opacity: opacity * occlusionOpacity, // Комбинируем обе прозрачности
          transition: 'opacity 0.15s ease',
          pointerEvents: occlusionOpacity > 0.5 ? 'auto' : 'none', // Отключаем клики когда скрыто
        }}
        // Убираем occlude, так как используем свой raycasting
      >
        <div
          onClick={handleClick}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          className="dot-button-container"
          style={{
            width: `${60 * scale}px`,
            height: `${60 * scale}px`,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Градиентный фон с анимацией */}
          <div
            className="gradient-border"
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: '50%',
              backgroundImage: `linear-gradient(45deg,
                transparent 10%,
                rgba(255, 255, 255, ${hovered ? 0.8 : 0.3}) 30%,
                rgba(200, 200, 255, ${hovered ? 0.6 : 0.2}) 50%,
                rgba(255, 255, 255, ${hovered ? 0.8 : 0.3}) 70%,
                transparent 90%)`,
              backgroundSize: '300% 300%',
              animation: 'gradient-flow 3s ease infinite',
              filter: hovered ? 'blur(2px)' : 'blur(1px)',
            }}
          />

          {/* Основная кнопка */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.0)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {svgIcon ? (
              <div
                className="user-svg-icon"
                style={{
                  width: '70%',
                  height: '70%',
                  display: 'block',
                }}
                dangerouslySetInnerHTML={{ __html: svgIcon }}
              />
            ) : undefined}
          </div>

          {/* Свечение */}
          {hovered && (
            <div
              style={{
                position: 'absolute',
                inset: -20,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                animation: 'pulse 2s ease-in-out infinite',
                pointerEvents: 'none',
              }}
            />
          )}
        </div>
      </Html>
    </group>
  );
};

export default DotButton;
