import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export default function SceneConfig() {
  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={1} color={"white"} />
      <directionalLight
        intensity={2}
        position={[5, 10, 5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight
        intensity={0.3}
        position={[0, 10, 0]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      <OrbitControls
        zoomSpeed={0.8}
        minDistance={10}
        maxDistance={30}
        target={[0, 3, 0]}
        minPolarAngle={THREE.MathUtils.degToRad(0)}
        maxPolarAngle={THREE.MathUtils.degToRad(90)}
      />
    </>
  );
}
