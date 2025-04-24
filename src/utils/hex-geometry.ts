import { HexagonFeature } from '@/types/hexagon';

export const getHexDistance = (a: HexagonFeature, b: HexagonFeature) => {
    const [x1, y1] = a.properties.gridPosition;
    const [x2, y2] = b.properties.gridPosition;

    return (Math.abs(x1 - x2) + Math.abs(x1 + y1 - x2 - y2) + Math.abs(y1 - y2)) / 2;
};
