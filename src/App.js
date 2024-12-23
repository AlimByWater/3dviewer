import { useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { getPixelRatio, isLowPerformanceDevice } from './pixelRatio'
import { useMask, useGLTF, Float, Instances, CameraControls, useProgress } from '@react-three/drei'
import { Lightformer, Environment, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'
import { useLaunchParams, postEvent } from '@telegram-apps/sdk-react'
import { get3DObject } from './data'
import ObjectView from './components/ObjectView'
import ProgressIndicator from './components/ProgressIndicator'
import AuthorsPage from './components/AuthorsPage'
import TriangleButton from './components/TriangleButton'

export default function App() {
  const lp = useLaunchParams()
  const obj3d = get3DObject(lp.startParam)
  const [isAuthorsPageOpen, setIsAuthorsPageOpen] = useState(false)
  const { progress } = useProgress()

  useEffect(() => {
    if (['android', 'android_x', 'ios'].includes(lp.platform)) {
      try {
        postEvent('web_app_request_fullscreen')
        postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false })
      } catch (e) {
        console.warn(e)
      }
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas
        dpr={getPixelRatio(isAuthorsPageOpen)}
        style={{ backgroundColor: obj3d.backgroundColor }}
        shadows
        camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 300 }}>
        <color attach="background" args={[obj3d.backgroundColor]} />
        {/** Стакан аквариума */}
        {obj3d.aquarium ? (
          <Aquarium position={[0, 0.25, 0]}>
            <Float rotationIntensity={isLowPerformanceDevice() ? 1 : 2} floatIntensity={isLowPerformanceDevice() ? 5 : 10} speed={2}>
              <ObjectView swimming={true} modelProps={obj3d} position={[0, -0.5, -1]} rotation={[0, Math.PI, 0]} scale={2} />
            </Float>
            <Instances renderOrder={-1000}>
              <sphereGeometry args={[1, isLowPerformanceDevice() ? 32 : 64, isLowPerformanceDevice() ? 32 : 64]} />
              <meshBasicMaterial depthTest={false} />
            </Instances>
          </Aquarium>
        ) : (
          <ObjectView swimming={false} modelProps={obj3d} position={obj3d.position} rotation={[0, Math.PI, 0]} scale={2} />
        )}
        {/** Мягкие тени */}
        <AccumulativeShadows
          temporal
          frames={isLowPerformanceDevice() ? 30 : 100}
          color="lightblue"
          colorBlend={2}
          opacity={0.7}
          scale={60}
          position={[0, -5, 0]}>
          <RandomizedLight
            amount={isLowPerformanceDevice() ? 4 : 8}
            radius={15}
            ambient={0.5}
            intensity={1}
            position={[-5, 10, -5]}
            size={20}
          />
        </AccumulativeShadows>
        {/** Пользовательская среда */}
        <Environment resolution={isLowPerformanceDevice() ? 256 : 1024}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            {(isLowPerformanceDevice() ? [2, 0, 2, 0] : [2, 0, 2, 0, 2, 0, 2, 0]).map((x, i) => (
              <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
            ))}
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
          </group>
        </Environment>
        <CameraControls truckSpeed={0} dollySpeed={1} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <ProgressIndicator />
      {progress === 100 && <TriangleButton onClick={() => setIsAuthorsPageOpen(true)} />}
      {isAuthorsPageOpen && <AuthorsPage onClose={() => setIsAuthorsPageOpen(false)} />}
    </div>
  )
}

function Aquarium({ children, ...props }) {
  const ref = useRef()
  const { nodes } = useGLTF('/driptech/shapes-transformed.glb')
  const stencil = useMask(1, false)
  useLayoutEffect(() => {
    // Применяем маску ко всем дочерним объектам
    ref.current.traverse((child) => child.material && Object.assign(child.material, { ...stencil }))
  }, [])
  return (
    <group {...props} dispose={null}>
      <mesh castShadow scale={[0.61 * 6, 0.8 * 6, 1 * 6]} geometry={nodes.Cube.geometry}>
        <MeshTransmissionMaterial
          backside
          samples={isLowPerformanceDevice() ? 2 : 4}
          thickness={3}
          chromaticAberration={isLowPerformanceDevice() ? 0.015 : 0.025}
          anisotropy={isLowPerformanceDevice() ? 0.05 : 0.1}
          distortion={isLowPerformanceDevice() ? 0.05 : 0.1}
          distortionScale={0.1}
          temporalDistortion={isLowPerformanceDevice() ? 0.1 : 0.2}
          iridescence={isLowPerformanceDevice() ? 0.5 : 1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, isLowPerformanceDevice() ? 700 : 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}
