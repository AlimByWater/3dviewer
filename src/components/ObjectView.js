import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function ObjectView(props) {
  const { scene, animations } = useGLTF(props.modelProps.model)
  const { actions, mixer } = useAnimations(animations, scene)
  useEffect(() => {
    mixer.timeScale = 0.5
  }, [])

  // Плавание
  useFrame((state) => {
    if (props.swimming) scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2
  })

  return <primitive object={scene} {...props} />
}
