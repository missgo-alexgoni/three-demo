import proj4 from "proj4";

// 중심 좌표 계산
export function getCenter(coords: number[][]) {
  const sum = coords.reduce(
    (acc, [lng, lat]) => {
      acc[0] += lng;
      acc[1] += lat;
      return acc;
    },
    [0, 0]
  );

  const length = coords.length;
  return [sum[0] / length, sum[1] / length];
}

// 상대 좌표 계산
export function getRelativeCoords(coords: number[][], center: number[]) {
  return coords.map(([lng, lat]) => [lng - center[0], lat - center[1]]);
}

// 좌표계 변환
export function latLngToXY(lng: number, lat: number): [number, number] {
  const wgs84 = "EPSG:4326"; // WGS84 좌표계
  // UTM 좌표계를 EPSG:32633으로 설정
  const webMercator = "EPSG:3857";
  const [x, y] = proj4(wgs84, webMercator, [lng, lat]);

  return [x, y];
}
