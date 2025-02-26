import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import data from "./data.json";

import { getCenter, getRelativeCoords, latLngToXY } from "./utils";
import SceneConfig from "./SceneConfig";

const HEIGHT = 1.5;

export default function ThreeComponent() {
  const buildingData = data.buildings[0].geometry.coordinates[0][0].map(
    ([lng, lat]) => latLngToXY(lng, lat)
  );
  // 건물 1층 기준 중심 좌표
  const centerCoord = getCenter(buildingData);

  return (
    <>
      <Canvas shadows>
        {/* Three.js 설정 컴포넌트 */}
        <SceneConfig />

        {/* 토지 컴포넌트 */}
        <LandObject centerCoord={centerCoord} />
        {/* 건물 컴포넌트 */}
        <MainBuilding centerCoord={centerCoord} />
      </Canvas>
    </>
  );
}

function LandObject({ centerCoord }: { centerCoord: number[] }) {
  const landData = data.land.geometry.coordinates[0][0].map(([lng, lat]) =>
    latLngToXY(lng, lat)
  );
  // 중심 좌표 기준으로 모든 꼭짓점에 대해 상대 좌표 계산
  const relativeCoord = getRelativeCoords(landData, centerCoord);

  // 좌표 기준 다각형 그리기
  const shape = new THREE.Shape();
  shape.moveTo(relativeCoord[0][0], relativeCoord[0][1]);
  for (let i = 1; i < relativeCoord.length; i++) {
    shape.lineTo(relativeCoord[i][0], relativeCoord[i][1]);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: 40,
    bevelEnabled: false,
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -40, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#CACACA" toneMapped={false} />
      </mesh>
    </>
  );
}

const MainBuilding = ({ centerCoord }: { centerCoord: number[] }) => {
  const buildingData = data.buildings[0].geometry.coordinates[0][0].map(
    ([lng, lat]) => latLngToXY(lng, lat)
  );
  // 중심 좌표 기준으로 모든 꼭짓점에 대해 상대 좌표 계산
  const relativeCoord = getRelativeCoords(buildingData, centerCoord);

  return (
    <>
      {/* 각 층별 3D Object */}
      <BuildingFloor coord={relativeCoord} height={0 * HEIGHT} />
    </>
  );
};

const BuildingFloor = ({
  coord,
  height,
  opacity = 1,
}: {
  coord: number[][];
  height: number;
  opacity?: number;
}) => {
  // 좌표 기준 다각형 그리기
  const shape = new THREE.Shape();
  shape.moveTo(coord[0][0], coord[0][1]);
  for (let i = 1; i < coord.length; i++) {
    shape.lineTo(coord[i][0], coord[i][1]);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: HEIGHT,
    bevelEnabled: false,
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, height, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={"#02BAFF"}
          opacity={opacity}
          transparent={opacity !== 1}
          toneMapped={false}
        />
      </mesh>

      {/* 외곽선 */}
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <edgesGeometry
          args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]}
        />
        <lineBasicMaterial color={"black"} linewidth={2} />
      </lineSegments>
    </>
  );
};
