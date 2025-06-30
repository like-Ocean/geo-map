import ReactDOM from 'react-dom/client';
import { App } from './App';

import './styles/index.css';
import 'maplibre-gl/dist/maplibre-gl.css';

const init = () => {
    const rootEl = document.getElementById('root');
    if (!rootEl) return;

    const root = ReactDOM.createRoot(rootEl);
    root.render(<App />);
};

init();
