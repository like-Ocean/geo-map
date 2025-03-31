import { mapTylerStyle } from '@/constants/maptiler';
import { DeckOverlay } from '../deck-overlay';
import { Map } from '@vis.gl/react-maplibre';
import { LayersList } from 'deck.gl';
import styles from './main-map.module.css';

export const MainMap = () => {
    const layers: LayersList = [];

    return (
        <div className={styles['main-map']}>
            <Map
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
