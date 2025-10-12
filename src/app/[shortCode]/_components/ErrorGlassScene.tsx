import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Text3D } from '@react-three/drei';
import { themeParams } from '@telegram-apps/sdk-react';

export default function ErrorGlassScene({ text }: { text: string }) {
  const backgroundColor = themeParams.secondaryBackgroundColor();

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        linear={true}
        style={{
          backgroundColor: backgroundColor,
        }}
      >
        {backgroundColor && (
          <color attach="background" args={[backgroundColor]} />
        )}
        <DynamicBackground />
        <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={50} />
        <GlassBackdropText text={text} />
        <GlassStars />
      </Canvas>
    </div>
  );
}

// ---------- Create Star Geometry ----------
function createStarExtrudeGeometry(
  points = 5,
  outerRadius = 1,
  innerRadius = 0.45,
  depth = 0.35,
) {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / (points * 2);
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + i * step;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const extrudeSettings: any = {
    depth,
    bevelEnabled: false,
    steps: 1,
  };

  let geom = new (THREE as any).ExtrudeGeometry(
    shape,
    extrudeSettings,
  ) as THREE.BufferGeometry;
  geom.rotateX(Math.PI);
  geom.translate(0, 0, -depth / 2);
  geom.computeVertexNormals();
  if (geom.index) {
    geom = geom.toNonIndexed();
    geom.computeVertexNormals();
  }
  flatNormals(geom);
  return geom;
}

function flatNormals(geom: THREE.BufferGeometry) {
  const pos = geom.attributes.position.array;
  const normals = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 9) {
    const a = new THREE.Vector3(pos[i], pos[i + 1], pos[i + 2]);
    const b = new THREE.Vector3(pos[i + 3], pos[i + 4], pos[i + 5]);
    const c = new THREE.Vector3(pos[i + 6], pos[i + 7], pos[i + 8]);
    const cb = new THREE.Vector3().subVectors(c, b);
    const ab = new THREE.Vector3().subVectors(a, b);
    const n = new THREE.Vector3().crossVectors(cb, ab).normalize();
    for (let j = 0; j < 3; j++) {
      normals[i + j * 3] = n.x;
      normals[i + j * 3 + 1] = n.y;
      normals[i + j * 3 + 2] = n.z;
    }
  }
  geom.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
}

// ---------- Materials ----------
function useGlassMaterials() {
  const glassMat = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      metalness: 0.0,
      roughness: 0.05,
      transmission: 1,
      thickness: 1.2,
      envMapIntensity: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      ior: 1.52,
      reflectivity: 0.5,
      side: THREE.DoubleSide,
      flatShading: true,
    });
  }, []);

  // --- Realistic dynamic iridescent shader ---
  const iridescentMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
        intensity: { value: 1.2 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vNormal = normalize(normalMatrix * normal);
          vec4 viewPosition = viewMatrix * worldPosition;
          vViewDir = normalize(-viewPosition.xyz);
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec3 vNormal;
        varying vec3 vViewDir;
        uniform float time;
        uniform float intensity;

        // Iridescence simulation based on thin-film interference
        vec3 spectralColor(float w) {
          float r = smoothstep(0.75, 0.55, w);
          float g = sin(w * 3.14159);
          float b = smoothstep(0.35, 0.55, w);
          return clamp(vec3(r, g, b), 0.0, 1.0);
        }

        void main() {
          vec3 N = normalize(vNormal);
          vec3 V = normalize(vViewDir);
          float angle = 1.0 - abs(dot(N, V));

          // interference pattern with subtle oscillation over time
          float filmThickness = 1.0 + 0.3 * sin(time * 0.7);
          float shift = (filmThickness * angle * 2.0) + time * 0.1;
          vec3 color = spectralColor(fract(shift));

          // smooth and soft blending on edges
          float edge = pow(angle, 3.0);
          vec3 finalColor = color * edge * intensity;

          gl_FragColor = vec4(finalColor, edge * 0.7);
        }
      `,
    });
  }, []);

  useFrame((_, delta) => {
    iridescentMat.uniforms.time.value += delta;
  });

  return { glassMat, iridescentMat };
}

// ---------- Dynamic Background ----------
export function DynamicBackground() {
  const meshRef = useRef<THREE.Mesh>(null);
  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uFade: { value: 0 } },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uFade;

      void main() {
        // Центр сцены
        vec2 center = vUv - 0.5;
        float dist = length(center);

        // Анимированный градиент с пастельными оттенками
        vec3 pastelBase = vec3(0.05, 0.05, 0.1);
        vec3 color = pastelBase;

        float t = uTime * 0.1;
        vec3 grad = vec3(
          0.5 + 0.5 * sin(3.0*center.x + t),
          0.5 + 0.5 * cos(3.0*center.y + t*1.1),
          0.5 + 0.5 * sin(3.0*(center.x + center.y) + t*1.3)
        );

        // Плавное смешивание с темным фоном, концентрируясь к центру
        float edgeFade = smoothstep(0.6, 0.0, dist);
        color += grad * 0.3 * edgeFade;

        // Пульсация свечения
        float pulse = 0.05 * sin(uTime * 1.5) + 0.95;
        color *= pulse;

        gl_FragColor = vec4(color, 1.0) * uFade;
      }
    `,
        side: THREE.DoubleSide,
      }),
    [],
  );

  const fade = useRef(0);

  useFrame((_, delta) => {
    if (shaderMat.uniforms.uTime) shaderMat.uniforms.uTime.value += delta;
    if (shaderMat.uniforms.uFade.value < 1) {
      fade.current = Math.min(fade.current + delta * 1.5, 1); // скорость появления 1.5
      shaderMat.uniforms.uFade.value = fade.current;
    }
  });

  const { camera, size } = useThree();

  // Функция для пересчёта размеров плоскости
  const updatePlaneSize = useCallback(() => {
    if (meshRef.current && camera instanceof THREE.PerspectiveCamera) {
      const z = -10;
      const height =
        2 *
        Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) *
        Math.abs(z - camera.position.z);
      const width = height * camera.aspect;

      // Удаляем старую геометрию перед созданием новой
      meshRef.current.geometry.dispose();
      const ratio = Math.max(width / 20, height / 20);
      meshRef.current.geometry = new THREE.PlaneGeometry(
        ratio * 20,
        ratio * 20,
      );
      meshRef.current.position.z = z;
    }
  }, [camera]);

  // Запускаем при монтировании и при изменении размера
  useEffect(() => {
    updatePlaneSize();
  }, [size.width, size.height, updatePlaneSize]);

  return <mesh ref={meshRef} material={shaderMat} />;
}

// ---------- Glass Stars ----------
export const GlassStars = React.forwardRef<THREE.Mesh, {}>((params, ref) => {
  return (
    <group position={new THREE.Vector3(0, 10)} scale={0.5}>
      <GlassStar position={new THREE.Vector3(-0.95, 0, 0)} />
      <GlassStar position={new THREE.Vector3(0, 1.5, 0)} />
      <GlassStar position={new THREE.Vector3(0.95, 0, 0)} />
    </group>
  );
});
GlassStars.displayName = 'GlassStars';

export const GlassStar = React.forwardRef<
  THREE.Mesh,
  { position: THREE.Vector3 }
>((params, ref) => {
  const geom = useMemo(() => createStarExtrudeGeometry(5, 1.6, 0.8, 0.28), []);
  const { glassMat, iridescentMat } = useGlassMaterials();

  return (
    <group position={params.position} scale={0.5}>
      <mesh ref={ref as any} geometry={geom} material={glassMat} />
      <mesh geometry={geom} material={iridescentMat} scale={1.01} />
    </group>
  );
});
GlassStar.displayName = 'GlassStar';

// ---------- Glass 404 Text ----------
export function GlassBackdropText({ text }: { text: string }) {
  const { glassMat, iridescentMat } = useGlassMaterials();
  const groupRef = useRef<THREE.Group>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const textEffectRef = useRef<THREE.Mesh>(null);

  const centerMesh = (mesh: THREE.Mesh) => {
    const geometry = mesh.geometry;
    if (mesh.geometry && !mesh.geometry.boundingBox) {
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox!;
      const width = boundingBox.max.x - boundingBox.min.x;
      const height = boundingBox.max.y - boundingBox.min.y;
      const depth = boundingBox.max.z - boundingBox.min.z;
      mesh.position.set(width * -0.5, height * -0.5, depth - 0.5);
    }
  };

  useFrame(({ clock }) => {
    // Вращение текста
    if (groupRef.current) {
      groupRef.current.rotation.set(
        Math.sin(clock.getElapsedTime() * 0.5) * 0.5,
        Math.cos(clock.getElapsedTime() * 1) * 0.25,
        0,
        'XYZ',
      );
    }
  });

  useEffect(() => {
    // Центрирование текста
    if (textRef.current) {
      centerMesh(textRef.current);
    }
    if (textEffectRef.current) {
      centerMesh(textEffectRef.current);
    }
  }, []);

  return (
    <group ref={groupRef} scale={2.5}>
      <Text3D
        ref={textRef}
        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
        size={1.8}
        height={0.2}
        bevelEnabled={false}
      >
        {text}
        <primitive attach="material" object={glassMat} />
      </Text3D>
      <Text3D
        ref={textEffectRef}
        font="https://threejs.org/examples/fonts/helvetiker_bold.typeface.json"
        size={1.801}
        height={0.201}
        bevelEnabled={false}
      >
        {text}
        <primitive attach="material" object={iridescentMat} />
      </Text3D>
    </group>
  );
}
