import { useControl } from '@vis.gl/react-maplibre';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { DeckProps } from 'deck.gl';

export const DeckOverlay = (props: DeckProps) => {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
};
