import { useEffect, useState } from 'react';
import { Alert } from 'antd';
import { bbox, hexGrid } from '@turf/turf';
import centerOfMass from '@turf/center-of-mass';
import { useGetLocationQuery } from '@renderer/api/nominatim/location/get-location';
import { mapTylerStyle } from '@renderer/constants/maptiler';
import { DeckOverlay } from '../deck-overlay';
import { LngLatBoundsLike, Map, useMap } from '@vis.gl/react-maplibre';
import { GeoJsonLayer, LayersList, TextLayer } from 'deck.gl';
import { useLocationStore } from '@renderer/store/location';
import { useHexagonStore } from '@renderer/store/hexagon';
import styles from './main-map.module.css';
import { Feature, Polygon } from 'geojson';
import { HexagonInputModal } from '@renderer/components/features/hexagon-input-modal';
import { HexagonFeature } from '@renderer/types/hexagon';

export const MainMap = () => {
    const { main: map } = useMap();

    const location = useLocationStore.use.location();
    const cellSize = useHexagonStore.use.cellSize();

    const hexagonValues = useHexagonStore.use.hexagonValues();
    const selectHexagon = useHexagonStore.use.selectHexagon();

    const setGrid = useHexagonStore.use.setGrid();

    const [layers, setLayers] = useState<LayersList>([]);

    const [maxValue, setMaxValue] = useState<number>(0);

    const { data } = useGetLocationQuery(
        location && {
            osm_type: location.osm_type,
            osm_id: location.osm_id,
        },
    );

    const showLabels = useHexagonStore.use.showLabels();

    useEffect(() => {
        if (!data || !map) return;

        const [minLng, minLat, maxLng, maxLat] = bbox(data.geometry);

        const bounds: LngLatBoundsLike = [
            [minLng, minLat],
            [maxLng, maxLat],
        ];

        map.fitBounds(bounds, { padding: 20, duration: 1000 });
    }, [map, data]);

    useEffect(() => {
        if (!data) return;

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
                // gridPosition: [index % 10, Math.floor(index / 10)],
                cellSize: cellSize,
                isUserValue: false,
            },
        }));

        setGrid(grid.features as HexagonFeature[]);

        const values = grid.features.map((f) => f.properties?.value || 0);
        const newMaxValue = Math.max(...values);
        setMaxValue(newMaxValue);

        setLayers([
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
                    const normalizedValue = maxValue > 0 ? value / maxValue : 0;
                    const r = 50;
                    const g = 150;
                    const b = 50;
                    const alpha = 100 + normalizedValue * 100;
                    return [r, g, b, alpha];
                },
                getLineColor: [0, 200, 0, 200],
                lineWidthMinPixels: 1,
                onClick: ({ object }) => {
                    const hexId = (object as Feature<Polygon>).id?.toString();
                    if (hexId) selectHexagon(hexId);
                },
            }),
            ...(showLabels
                ? [
                      new TextLayer<HexagonFeature>({
                          id: 'hexagon-values-text',
                          data: grid.features as HexagonFeature[],
                          pickable: false,
                          getPosition: (d) => {
                              const centroid = centerOfMass(d);
                              return centroid.geometry.coordinates as [number, number];
                          },
                          getText: (d) => {
                              const value = d.properties.value;

                              const formattedValue = Number.isInteger(value)
                                  ? value.toString()
                                  : value.toFixed(2);

                              return value > 0 ? formattedValue : '';
                          },
                          getSize: 16,
                          getAngle: 0,
                          getTextAnchor: 'middle',
                          getAlignmentBaseline: 'center',
                          getColor: [0, 0, 0, 200],
                      }),
                  ]
                : []),
        ]);
    }, [cellSize, data, hexagonValues, selectHexagon, setGrid, maxValue, showLabels]);

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
            <Alert
                className={styles.alertBottomLeft}
                message="⚠️ Приложение в разработке. Возможны ошибки в вычислениях и нестабильная работа."
                type="warning"
                closable
            />
        </div>
    );
};
