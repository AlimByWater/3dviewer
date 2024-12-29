import "./View.css";

import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  CameraControls,
  Lightformer,
  Environment,
  RandomizedLight,
  AccumulativeShadows,
} from "@react-three/drei";
import {
  getPixelRatio,
  isLowPerformanceDevice,
} from "../../../utils/pixelRatio";
import WorkView from "./WorkView";
import WorkInAquariumView from "./WorkInAquariumView";
import { Work } from "@/types/work";

const View = ({
  work,
  isAuthorsPageOpen,
}: {
  work: Work;
  isAuthorsPageOpen: boolean;
}) => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <Canvas
        dpr={getPixelRatio(isAuthorsPageOpen)}
        style={{ backgroundColor: work.backgroundColor }}
        shadows
        camera={{ position: [30, 0, -3], fov: 35, near: 1, far: 300 }}
        gl={{ stencil: true }}
      >
        <color attach="background" args={[work.backgroundColor]} />
        {/** Стакан аквариума */}
        {work.inAquarium ? (
          <WorkInAquariumView work={work} />
        ) : (
          <WorkView work={work} />
        )}
        {/** Мягкие тени */}
        <AccumulativeShadows
          temporal
          frames={isLowPerformanceDevice() ? 30 : 100}
          color="lightblue"
          colorBlend={2}
          opacity={0.7}
          scale={60}
          position={[0, -5, 0]}
        >
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
            <Lightformer
              intensity={4}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            {(isLowPerformanceDevice()
              ? [2, 0, 2, 0]
              : [2, 0, 2, 0, 2, 0, 2, 0]
            ).map((x, i) => (
              <Lightformer
                key={i}
                form="circle"
                intensity={4}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[50, 2, 1]}
            />
          </group>
        </Environment>
        <CameraControls
          truckSpeed={0}
          dollySpeed={1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default View;
