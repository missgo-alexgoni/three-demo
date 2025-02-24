"use client";

import { Line, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useState } from "react";

export default function App() {
  const [compassRotation, setCompassRotation] = useState(0); // 카메라 방향 상태

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        position: "relative",
      }}
    >
      <Canvas shadows camera={{ position: [0, 6, 22] }}>
        <MyElement3D setCompassRotation={setCompassRotation} />
      </Canvas>

      <Compass compassRotation={compassRotation} />
    </div>
  );
}

const FLOORS = 5; // 층 수 설정
const HEIGHT_PER_FLOOR = 1.5; // 층 높이
const WIDTH = 3; // 건물 가로 크기
const DEPTH = 2; // 건물 세로 크기
const BUILDING_COLOR = "#02BAFF";

function MyElement3D({
  setCompassRotation,
}: {
  setCompassRotation: (rotation: number) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    const rotation = THREE.MathUtils.radToDeg(Math.atan2(dir.x, dir.z)) - 180;

    setCompassRotation(rotation);
  });

  // 경계선 생성 함수 (층 높이에 따라 자동 조정)
  const generateCeilPoints = (floor: number) => {
    const y = floor * HEIGHT_PER_FLOOR;
    return [
      new THREE.Vector3(-WIDTH / 2, y, DEPTH / 2),
      new THREE.Vector3(WIDTH / 2, y, DEPTH / 2),
      new THREE.Vector3(WIDTH / 2, y, -DEPTH / 2),
      new THREE.Vector3(-WIDTH / 2, y, -DEPTH / 2),
      new THREE.Vector3(-WIDTH / 2, y, DEPTH / 2),
    ];
  };

  // 세로선 생성 함수
  const generateVerticalLines = () => {
    const verticalLines = [];
    for (let i = 0; i <= FLOORS; i++) {
      // 0층부터 포함
      const y1 = i * HEIGHT_PER_FLOOR;
      const y2 = (i + 1) * HEIGHT_PER_FLOOR;

      const corners = [
        new THREE.Vector3(-WIDTH / 2, y1, DEPTH / 2),
        new THREE.Vector3(WIDTH / 2, y1, DEPTH / 2),
        new THREE.Vector3(WIDTH / 2, y1, -DEPTH / 2),
        new THREE.Vector3(-WIDTH / 2, y1, -DEPTH / 2),
      ];

      if (i < FLOORS) {
        corners.forEach((corner) => {
          verticalLines.push([
            corner,
            new THREE.Vector3(corner.x, y2, corner.z),
          ]);
        });
      }
    }
    return verticalLines;
  };

  return (
    <>
      {/* 조명 */}
      <ambientLight intensity={1} />
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
      {/* 바닥 */}
      <mesh position={[0, -20, 0]} receiveShadow>
        <boxGeometry args={[30, 40, 30]} />
        <meshStandardMaterial color="#CACACA" />
      </mesh>

      {/* 층 생성 */}
      {[...Array(FLOORS)].map((_, i) => (
        <mesh
          key={i}
          position={[0, i * HEIGHT_PER_FLOOR + HEIGHT_PER_FLOOR / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[WIDTH, HEIGHT_PER_FLOOR, DEPTH]} />
          <meshStandardMaterial
            color={BUILDING_COLOR}
            transparent={i === 0}
            opacity={i === 0 ? 0.5 : 1}
          />
        </mesh>
      ))}

      {/* 바닥선 (0층 추가) */}
      <Line points={generateCeilPoints(0)} color="#000000" lineWidth={1} />

      {/* 가로선 (층별 테두리) */}
      {[...Array(FLOORS)].map((_, i) => (
        <Line
          key={`h-${i}`}
          points={generateCeilPoints(i + 1)}
          color="#000000"
          lineWidth={1}
        />
      ))}

      {/* 세로선 (층을 연결하는 모서리) */}
      {generateVerticalLines().map((line, index) => (
        <Line key={`v-${index}`} points={line} color="#000000" lineWidth={1} />
      ))}

      <gridHelper args={[15, 20]} />

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

function Compass({ compassRotation }: { compassRotation: number }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "40px",
        left: "40px",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        zIndex: 10,
        border: "2px solid #2d2d2d",
        transform: `rotate(${compassRotation}deg)`,
      }}
    >
      <div
        style={{
          width: "2px",
          height: "20px",
          backgroundColor: "#2d2d2d",
          position: "absolute",
          top: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "-16px",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#2d2d2d",
        }}
      >
        N
      </div>
    </div>
  );
}
