import { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMask, useGLTF, Float, Instances, CameraControls } from '@react-three/drei'
import { Lightformer, Environment, RandomizedLight, AccumulativeShadows, MeshTransmissionMaterial } from '@react-three/drei'
import { useLaunchParams, postEvent } from '@telegram-apps/sdk-react'
import { get3DObject } from './data'
import ObjectView from './components/ObjectView'
import ProgressIndicator from './components/ProgressIndicator'

export default function App() {
  const lp = useLaunchParams()
  const obj3d = get3DObject(lp.startParam)

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
      <Canvas style={{ backgroundColor: obj3d.backgroundColor }} shadows camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 300 }}>
        <color attach="background" args={[obj3d.backgroundColor]} />
        {/** Стакан аквариума */}
        {obj3d.aquarium ? (
          <Aquarium position={[0, 0.25, 0]}>
            <Float rotationIntensity={2} floatIntensity={10} speed={2}>
              <ObjectView swimming={true} modelProps={obj3d} position={[0, -0.5, -1]} rotation={[0, Math.PI, 0]} scale={2} />
            </Float>
            <Instances renderOrder={-1000}>
              <sphereGeometry args={[1, 64, 64]} />
              <meshBasicMaterial depthTest={false} />
            </Instances>
          </Aquarium>
        ) : (
          <ObjectView swimming={false} modelProps={obj3d} position={obj3d.position} rotation={[0, Math.PI, 0]} scale={2} />
        )}
        {/** Мягкие тени */}
        <AccumulativeShadows temporal frames={100} color="lightblue" colorBlend={2} opacity={0.7} scale={60} position={[0, -5, 0]}>
          <RandomizedLight amount={8} radius={15} ambient={0.5} intensity={1} position={[-5, 10, -5]} size={20} />
        </AccumulativeShadows>
        {/** Пользовательская среда */}
        <Environment resolution={1024}>
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer key={i} form="circle" intensity={4} rotation={[Math.PI / 2, 0, 0]} position={[x, 4, i * 4]} scale={[4, 1, 1]} />
            ))}
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[50, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[50, 2, 1]} />
          </group>
        </Environment>
        <CameraControls truckSpeed={0} dollySpeed={1} minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <ProgressIndicator />
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
          samples={4}
          thickness={3}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.2}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
        />
      </mesh>
      <group ref={ref}>{children}</group>
    </group>
  )
}
