import { HexagonFeature } from '@/types/hexagon';
import { getHexDistance } from './hex-geometry';

export const calculateTension = (
    hexagons: HexagonFeature[],
    sources: Record<string, number>
): HexagonFeature[] => {
    return hexagons.map(hex => {

        if (hex.properties?.isUserValue) return hex;
        
        let total = 0;
        
        for (const [sourceId, value] of Object.entries(sources)) {
            const sourceHex = hexagons.find(h => h.id === sourceId);
            if (!sourceHex) continue;
            
            const distance = getHexDistance(hex, sourceHex);
            if (distance === 0) continue;
            
            total += value / Math.pow(distance, 2);
        }
        
        return {
            ...hex,
            properties: {
                ...hex.properties,
                value: total
            }
        };
    });
};