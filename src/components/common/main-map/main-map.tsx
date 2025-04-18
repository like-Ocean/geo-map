import { useEffect } from 'react';
import { bbox, hexGrid } from '@turf/turf';
import centerOfMass from '@turf/center-of-mass';
import { useGetLocationQuery } from '@/api/nominatim/location/get-location';
import { mapTylerStyle } from '@/constants/maptiler';
import { DeckOverlay } from '../deck-overlay';
import { LngLatBoundsLike, Map, useMap } from '@vis.gl/react-maplibre';
import { GeoJsonLayer, LayersList, TextLayer } from 'deck.gl';
import { useLocationStore } from '@/store/location';
import { useHexagonStore } from '@/store/hexagon';
import styles from './main-map.module.css';
import { Feature, Polygon } from 'geojson';
import { HexagonInputModal } from '@/components/features/hexagon-input-modal';
import { HexagonFeature } from '@/types/hexagon';

export const MainMap = () => {
    const { main: map } = useMap();

    const location = useLocationStore.use.location();
    const cellSize = useHexagonStore.use.cellSize();

    const hexagonValues = useHexagonStore.use.hexagonValues();
    const selectHexagon = useHexagonStore.use.selectHexagon();

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
        const grid = hexGrid(bbox(data.geometry), cellSize, {
            units: 'kilometers',
            mask: {
                type: 'Feature',
                properties: {},
                geometry: data.geometry,
            } as Feature<Polygon>,
        });

        grid.features = grid.features.map((feature, index) => ({
            ...feature,
            id: `hex-${index}`,
            properties: {
                ...feature.properties,
                value: hexagonValues[`hex-${index}`] || 0,
            },
        }));

        const textLayer = new TextLayer<HexagonFeature>({
            id: 'hexagon-values-text',
            data: grid.features as HexagonFeature[],
            pickable: false,
            getPosition: (d) => {
                const centroid = centerOfMass(d);
                return centroid.geometry.coordinates as [number, number];
            },
            getText: (d) => {
                const value = d.properties.value;
                return value > 0 ? value.toString() : '';
            },
            getSize: 16,
            getAngle: 0,
            getTextAnchor: 'middle',
            getAlignmentBaseline: 'center',
            getColor: [0, 0, 0, 200],
        });

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

            new GeoJsonLayer({
                id: 'hexagon-grid',
                data: grid,
                pickable: true,
                stroked: true,
                filled: true,
                getFillColor: (f) => {
                    const value = (f as Feature<Polygon>).properties?.value || 0;
                    return [50, 150, 50, 100 + Math.min(value / 1000, 155)];
                },
                getLineColor: [0, 200, 0, 200],
                lineWidthMinPixels: 1,
                onClick: ({ object }) => {
                    const hexId = (object as Feature<Polygon>).id?.toString();
                    if (hexId) selectHexagon(hexId);
                },
            }),
            textLayer,
        );
    }

    return (
        <div className={styles['main-map']}>
            <HexagonInputModal />
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
