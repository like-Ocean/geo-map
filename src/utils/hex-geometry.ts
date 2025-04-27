import { distance, centerOfMass } from '@turf/turf';
import { HexagonFeature } from '@/types/hexagon';

export const getHexDistance = (a: HexagonFeature, b: HexagonFeature) => {
    const centerA = centerOfMass(a);
    const centerB = centerOfMass(b);
    return distance(centerA, centerB, { units: 'kilometers' });
};