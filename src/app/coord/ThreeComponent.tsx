import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import data from "./data4.json";
import { getCenter, getRelativeCoords, parsePolygon } from "./utils";
import SceneConfig from "./SceneConfig";
import { useRef, useState } from "react";

const HEIGHT = 1.5;

export default function ThreeComponent({
  setCompassRotation,
}: {
  setCompassRotation: (rotation: number) => void;
}) {
  return (
    <>
      <Canvas shadows>
        <Scene setCompassRotation={setCompassRotation} />
      </Canvas>
    </>
  );
}

function Scene({
  setCompassRotation,
}: {
  setCompassRotation: (rotation: number) => void;
}) {
  const massData: MassData = data.mass;
  const baseCoords = parsePolygon(massData[0]);
  const baseCenter = getCenter(baseCoords);
  const { camera } = useThree();

  useFrame(() => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    const rotation = THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z)) - 180;

    setCompassRotation(rotation);
  });

  return (
    <>
      <SceneConfig />

      {/* 바닥 */}
      <mesh position={[0, -20, 0]} receiveShadow>
        <boxGeometry args={[50, 40, 50]} />
        <meshStandardMaterial color="#CACACA" toneMapped={false} />
      </mesh>

      {/* 메인 건물 */}
      <MainBuilding />
      {/* <RequlationBoundary baseCenter={baseCenter} /> */}
      <SiteElement baseCenter={baseCenter} />
      <AroundBuildings baseCenter={baseCenter} />
    </>
  );
}

type Coord = number[][];
type MassData = string[];

const MainBuilding = () => {
  const massData: MassData = data.mass;
  const baseCoords = parsePolygon(massData[0]);
  const baseCenter = getCenter(baseCoords);

  return (
    <>
      {massData.map((polygon, index) => {
        const rawCoords = parsePolygon(polygon);
        const relativeCoords = getRelativeCoords(rawCoords, baseCenter);

        return (
          <Element
            key={index}
            coord={relativeCoords}
            height={index * HEIGHT}
            opacity={index === 0 ? 0.5 : 1}
          />
        );
      })}
    </>
  );
};

const Element = ({
  coord,
  height,
  opacity = 1,
}: {
  coord: Coord;
  height: number;
  opacity?: number;
}) => {
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

      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <edgesGeometry
          args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]}
        />
        <lineBasicMaterial color={"black"} linewidth={2} />
      </lineSegments>
    </>
  );
};

const CoreElement = ({ baseCenter }: { baseCenter: number[] }) => {
  const core = data.core;
  const parsedCoord = parsePolygon(core);
  const relativeCoords = getRelativeCoords(parsedCoord, baseCenter);

  return (
    <>
      <TempObject coord={relativeCoords} color="red" />
    </>
  );
};

const SiteElement = ({ baseCenter }: { baseCenter: number[] }) => {
  const core = data.site;
  const parsedCoord = parsePolygon(core);
  const relativeCoords = getRelativeCoords(parsedCoord, baseCenter);

  return (
    <>
      <TempObject
        coord={relativeCoords}
        color="#818181"
        height={0.1}
        toneMapped={false}
      />
    </>
  );
};

const ArchiLineElement = ({ baseCenter }: { baseCenter: number[] }) => {
  const core = data.archi_line;
  const parsedCoord = parsePolygon(core);
  const relativeCoords = getRelativeCoords(parsedCoord, baseCenter);

  return (
    <>
      <TempObject coord={relativeCoords} color="teal" />
    </>
  );
};

const AroundBuildings = ({ baseCenter }: { baseCenter: number[] }) => {
  const dataSet = data.field.dataSet;
  const pnu = data.pnu;

  return (
    <>
      {dataSet.map((item, index) => {
        if (String(pnu) === item.PNU || item.jimokCode === 14) return;

        const rawCoords = parsePolygon(item.WKT);
        const relativeCoords = getRelativeCoords(rawCoords, baseCenter);

        return (
          <TempObject
            key={index}
            coord={relativeCoords}
            color="white"
            height={0.05}
            toneMapped={false}
          />
        );
      })}
    </>
  );
};

const RequlationBoundary = ({ baseCenter }: { baseCenter: number[] }) => {
  const dataSet = data.regulation_boundary;

  return (
    <>
      {dataSet.map((data, index) => {
        const rawCoords = parsePolygon(data);
        const relativeCoords = getRelativeCoords(rawCoords, baseCenter);

        return (
          <TempObject
            key={index}
            coord={relativeCoords}
            color="red"
            height={1}
          />
        );
      })}
    </>
  );
};

const TempObject = ({
  coord,
  opacity = 1,
  color,
  height = 1,
  toneMapped = true,
}: {
  coord: Coord;
  opacity?: number;
  color: string;
  height?: number;
  toneMapped?: boolean;
}) => {
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
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color={color}
          opacity={opacity}
          transparent={opacity !== 1}
          roughness={0.1}
          toneMapped={toneMapped}
        />
      </mesh>

      <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <edgesGeometry
          args={[new THREE.ExtrudeGeometry(shape, extrudeSettings)]}
        />
        <lineBasicMaterial color={"black"} linewidth={1} />
      </lineSegments>
    </>
  );
};
