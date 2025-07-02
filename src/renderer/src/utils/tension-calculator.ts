import { HexagonFeature } from '@renderer/types/hexagon';
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
            
            let distKm = getHexDistance(hex, sourceHex);
            const cellSize = hex.properties.cellSize;
            // P = cellside * 6 = периметр 6-ти угольника
            // а затем distKm / P
            const P = cellSize * 2
            if (distKm >= 187) // добавить если 148 + 25
                distKm += 25
            const n = Math.ceil((distKm / P));
            console.log("cellside*2: " + P)
            console.log("distKm ", hex.id, distKm)
            console.log(hex.id, "distKm / cellSize ", Math.trunc((distKm / cellSize)))
            console.log(hex.id, "Через P ", Math.ceil((distKm / P)))
            console.log(hex.id, "Через P без округления", (distKm / P))
            console.log("---------------")
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