import { useEffect } from 'react';
import { bbox, hexGrid } from '@turf/turf';
import { useGetLocationQuery } from '@/api/nominatim/location/get-location';
import { mapTylerStyle } from '@/constants/maptiler';
import { DeckOverlay } from '../deck-overlay';
import { LngLatBoundsLike, Map, useMap } from '@vis.gl/react-maplibre';
import { GeoJsonLayer, LayersList } from 'deck.gl';
import { useLocationStore } from '@/store/location';
import styles from './main-map.module.css';
import { Feature, Polygon } from 'geojson';

export const MainMap = () => {
  const { main: map } = useMap();
  const location = useLocationStore.use.location();
  const cellSize = useLocationStore.use.cellSize();

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

    const grid = hexGrid(
      bbox(data.geometry), 
      cellSize,
      {
        units: 'kilometers',
        mask: { 
          type: 'Feature',
          properties: {},
          geometry: data.geometry
        } as Feature<Polygon>
      }
    );

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
        getFillColor: [0, 200, 0, 50],
        getLineColor: [0, 200, 0, 200],
        lineWidthMinPixels: 1,
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
