/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import data from "./data.json";

import { getCenter, getRelativeCoords, latLngToXY } from "./utils";
import SceneConfig from "./SceneConfig";

export default function ThreeComponent() {
  let buildingLatLngData = data.buildPolygon.map((floor) => ({
    ...floor,
    coordinates: floor.coordinates.map(([lng, lat]) => latLngToXY(lng, lat)),
  }));
  const centerCoord = getCenter(buildingLatLngData[0].coordinates);
  // @ts-ignore
  buildingLatLngData = buildingLatLngData.map((floor) => ({
    ...floor,
    coordinates: getRelativeCoords(
      floor.coordinates as [number, number][],
      centerCoord
    ),
  }));

  const landData = data.landPolygon.coordinates.map(([lng, lat]) =>
    latLngToXY(lng, lat)
  );
  const relativeLandCoord = getRelativeCoords(landData, centerCoord);

  return (
    <>
      <Canvas shadows camera={{ position: [0, 6, 22] }}>
        {/* Three.js 설정 컴포넌트 */}
        <SceneConfig />

        {/* 바닥 */}
        <mesh position={[0, -20, 0]} receiveShadow>
          <boxGeometry args={[80, 40, 80]} />
          <meshStandardMaterial color="#d6d6d6" toneMapped={false} />
        </mesh>

        {/* 토지 컴포넌트 */}
        <LandObject coord={relativeLandCoord} />
        {/* 건물 컴포넌트 */}
        <MainBuilding data={buildingLatLngData} />
      </Canvas>
    </>
  );
}

function LandObject({ coord }: { coord: number[][] }) {
  // 좌표 기준 다각형 그리기
  const shape = new THREE.Shape();
  shape.moveTo(coord[0][0], coord[0][1]);
  for (let i = 1; i < coord.length; i++) {
    shape.lineTo(coord[i][0], coord[i][1]);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: 0.05,
    bevelEnabled: false,
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial color="#818181" toneMapped={false} />
      </mesh>
    </>
  );
}

interface MainBuildingProps {
  data: {
    coordinates: [number, number][];
    floor: number;
    height: number;
  }[];
}

const MainBuilding = ({ data }: MainBuildingProps) => {
  let accumulatedHeight = 0;

  return (
    <>
      {data.map((floor, idx) => {
        if (idx !== 0) {
          accumulatedHeight += data[idx - 1].height;
        }

        return (
          <>
            <BuildingFloor
              coord={floor.coordinates}
              height={floor.height}
              opacity={idx === 0 ? 0.5 : 1}
              floor={accumulatedHeight}
            />
          </>
        );
      })}
    </>
  );
};

const BuildingFloor = ({
  coord,
  height,
  opacity = 1,
  floor,
}: {
  coord: number[][];
  height: number;
  opacity?: number;
  floor: number;
}) => {
  // 좌표 기준 다각형 그리기
  const shape = new THREE.Shape();
  shape.moveTo(coord[0][0], coord[0][1]);
  for (let i = 1; i < coord.length; i++) {
    shape.lineTo(coord[i][0], coord[i][1]);
  }
  shape.closePath();

  const extrudeSettings = {
    depth: height,
    bevelEnabled: false,
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, floor, 0]}
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
      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, floor, 0]}>
        <edgesGeometry
          args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]}
        />
        <lineBasicMaterial color={"black"} linewidth={2} />
      </lineSegments>
    </>
  );
};
