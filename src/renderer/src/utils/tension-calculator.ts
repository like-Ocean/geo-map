import { HexagonFeature } from '@renderer/types/hexagon';
import { getHexDistance } from './hex-geometry';

export const calculateTension = (
    hexagons: HexagonFeature[],
    sources: Record<string, number>,
): HexagonFeature[] => {
    return hexagons.map((hex) => {
        if (hex.properties.isUserValue) return hex;

        let total = 0;
        for (const [sourceId, value] of Object.entries(sources)) {
            const sourceHex = hexagons.find((h) => h.id === sourceId);
            if (!sourceHex) continue;

            let distKm = getHexDistance(hex, sourceHex);
            const cellSize = hex.properties.cellSize;
            const P = cellSize * 2;

            if (cellSize == 45) {
                if (distKm >= 187) 
                    distKm += 25;
            }

            if (cellSize == 30) {
                if (distKm >= 200 || distKm >= 175) 
                    distKm += P;
            }

            if (cellSize == 25) {
                if (distKm >= 188) 
                    distKm += P;
            }

            if (cellSize == 20) {
                if (distKm >= 150) 
                    distKm += P;
            }
            
            if (cellSize == 10) {
                if (distKm >= 75) 
                    distKm += P;
            }

            if (cellSize == 5) {
                if (distKm >= 35) 
                    distKm += P;
            }

            const circleNumber = Math.ceil(distKm / P);

            if (circleNumber === 0) continue;
            total += value / Math.pow(circleNumber, 2);
        }

        return {
            ...hex,
            properties: {
                ...hex.properties,
                value: hex.properties.value + total,
            },
        };
    });
};
