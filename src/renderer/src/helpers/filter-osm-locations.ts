import { OSMLocation } from '@renderer/types/location';

export const filterOsmLocations = (locations: OSMLocation[]) => {
    return locations.filter((location) => {
        return location.type !== 'administrative';
    });
};
