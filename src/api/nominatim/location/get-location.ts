import { QueryOptions } from '@/api/types';
import { skipToken, useQuery } from '@tanstack/react-query';
import { nominatimApi } from '@/api/nominatim';
import { Geometry } from 'geojson';
import { Falsy } from '@/types/app';

export interface GetLocationsParams {
    osm_type: string;
    osm_id: number;
}

export interface GetLocationData {
    geometry: Geometry;
}

export const getLocationsPath = '/details.php';

export const getLocation = async (params: GetLocationsParams) => {
    const response = await nominatimApi.get<GetLocationData>(getLocationsPath, {
        params: {
            format: 'json',
            polygon_geojson: 1,
            osmtype: params.osm_type[0].toUpperCase(),
            osmid: params.osm_id,
        },
    });

    return response.data;
};

export const useGetLocationQuery = (
    params?: GetLocationsParams | Falsy,
    options?: QueryOptions<GetLocationData>,
) => {
    return useQuery({
        queryKey: [getLocationsPath, params],
        queryFn: params ? () => getLocation(params) : skipToken,
        ...options,
    });
};
