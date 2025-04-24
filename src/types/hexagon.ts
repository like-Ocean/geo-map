import { Feature, Polygon } from 'geojson';

export interface HexagonFeature extends Feature<Polygon> {
    id: string;
    properties: {
        value: number;
        gridPosition: [number, number];
        isUserValue?: boolean;
    };
}

