import { QueryOptions } from '@renderer/api/types';
import { useQuery } from '@tanstack/react-query';
import { nominatimApi } from '@renderer/api/nominatim';
import { OSMLocation } from '@renderer/types/location';

export interface SearchLocationsParams {
    search: string;
    geojson?: boolean;
}

export const searchLocationsPath = '/search';

export const searchLocations = async (params: SearchLocationsParams) => {
    const response = await nominatimApi.get<OSMLocation[]>(searchLocationsPath, {
        params: {
            format: 'json',
            polygon_geojson: params.geojson ? 1 : 0,
            q: params.search,
        },
    });

    return response.data;
};

export const useSearchLocationsQuery = (
    params: SearchLocationsParams,
    options?: QueryOptions<OSMLocation[]>,
) => {
    return useQuery({
        queryKey: [searchLocationsPath, params],
        queryFn: () => searchLocations(params),
        ...options,
    });
};
