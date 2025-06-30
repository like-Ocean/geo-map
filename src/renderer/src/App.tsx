import { MapProvider } from 'react-map-gl/maplibre';
import { MainMap } from './components/common/main-map';
import { Toolbar } from './components/common/toolbar';
import { AntProvider } from './providers/ant-provider';
import { QueryProvider } from './providers/query-provider';

export const App = () => {
    return (
        <QueryProvider>
            <AntProvider>
                <MapProvider>
                    <MainMap />
                    <Toolbar />
                </MapProvider>
            </AntProvider>
        </QueryProvider>
    );
};
