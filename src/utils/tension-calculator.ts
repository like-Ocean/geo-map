import { HexagonFeature } from '@/types/hexagon';
import { getHexDistance } from './hex-geometry';

export const calculateTension = (
    hexagons: HexagonFeature[],
    sources: Record<string, number>
): HexagonFeature[] => {
    return hexagons.map(hex => {
        if (hex.properties.isUserValue) return hex;
        
        let total = 0;
        for (const [sourceId, value] of Object.entries(sources)) {
            const sourceHex = hexagons.find(h => h.id === sourceId);
            if (!sourceHex) continue;
            
            const distKm = getHexDistance(hex, sourceHex);
            const cellSize = hex.properties.cellSize;
            const n = Math.trunc((distKm / cellSize));
            if (n === 0) continue;
            total += value / Math.pow(n, 2);
        }
        
        return {
            ...hex,
            properties: {
                ...hex.properties,
                value: hex.properties.value + total
            }
        };
    });
};