type Coord = number[][];

export const parsePolygon = (polygon: string): Coord => {
  return polygon
    .replace(/^(POLYGON|MULTIPOLYGON)\s*\(\(+/, "") // "POLYGON((" 또는 "MULTIPOLYGON(((" 제거
    .replace(/\)+$/, "") // 끝의 "))" 또는 ")))" 제거
    .split(",") // 쉼표 기준으로 좌표 나누기
    .map((point) => {
      const [x, y] = point.trim().split(/\s+/).map(Number); // 여러 개의 공백도 처리
      return [x, y];
    });
};

export const getCenter = (coords: Coord) => {
  const xSum = coords.reduce((sum, [x]) => sum + x, 0);
  const ySum = coords.reduce((sum, [, y]) => sum + y, 0);
  return [xSum / coords.length, ySum / coords.length];
};

export const getRelativeCoords = (coords: Coord, baseCenter: number[]) => {
  return coords.map(([x, y]) => [
    (x - baseCenter[0]) / 2,
    (y - baseCenter[1]) / 2,
  ]);
};
