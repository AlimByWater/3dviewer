import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'

/*
Author: DigitalLife3D (https://sketchfab.com/DigitalLife3D)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/model-52a-kemps-ridley-sea-turtle-no-id-7aba937dfbce480fb3aca47be3a9740b
Title: Model 52A - Kemps Ridley Sea Turtle (no ID)
*/
export default function ObjectView(props) {
    const { scene, animations } = useGLTF(props.modelProps.model)
    const { actions, mixer } = useAnimations(animations, scene)
    useEffect(() => {
      mixer.timeScale = 0.5
    }, [])
    useFrame((state) => (scene.rotation.z = Math.sin(state.clock.elapsedTime / 4) / 2))
    return <primitive object={scene} {...props} />
  }
  