import { useGetLocationQuery } from '@/api/nominatim/location/get-location';
import { mapTylerStyle } from '@/constants/maptiler';
import { DeckOverlay } from '../deck-overlay';
import { LngLatBoundsLike, Map, useMap } from '@vis.gl/react-maplibre';
import { GeoJsonLayer, LayersList } from 'deck.gl';
import { useLocationStore } from '@/store/location';
import { useEffect } from 'react';
import { bbox } from '@turf/turf';
import styles from './main-map.module.css';

export const MainMap = () => {
    const { main: map } = useMap();
    const location = useLocationStore.use.location();

    const { data } = useGetLocationQuery(
        location && {
            osm_type: location.osm_type,
            osm_id: location.osm_id,
        },
    );

    useEffect(() => {
        if (!data || !map) return;

        const [minLng, minLat, maxLng, maxLat] = bbox(data.geometry);

        const bounds: LngLatBoundsLike = [
            [minLng, minLat],
            [maxLng, maxLat],
        ];

        map.fitBounds(bounds, { padding: 20, duration: 1000 });
    }, [map, data]);

    const layers: LayersList = [];

    if (data) {
        layers.push(
            new GeoJsonLayer({
                id: 'selected-location-area',
                data: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: data.geometry,
                    },
                ],
                filled: true,
                stroked: true,
                lineWidthMinPixels: 2,
                getLineColor: [255, 0, 0, 100],
                getFillColor: [255, 0, 0, 20],
            }),
        );
    }

    return (
        <div className={styles['main-map']}>
            <Map
                id="main"
                initialViewState={{
                    longitude: 60.597474,
                    latitude: 56.838011,
                    zoom: 11,
                }}
                mapStyle={mapTylerStyle}
            >
                <DeckOverlay layers={layers} />
            </Map>
        </div>
    );
};
