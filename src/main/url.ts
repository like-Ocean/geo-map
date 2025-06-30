import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// The built directory structure
//
// ├─┬ dist
// │ ├─┬ main
// │ │ └── index.js    > Electron-MainPage
// │ ├─┬ preload
// │ │ └── index.mjs   > Preload-Scripts
// │ └─┬ renderer
// │   └── index.html    > Electron-Renderer

const DIST_PATH = join(__dirname, '../');

const RENDERER_DIST_PATH = join(DIST_PATH, 'renderer');
const PRELOAD_DIST_PATH = join(DIST_PATH, 'preload');

export const DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
export const VITE_PUBLIC_PATH = DEV_SERVER_URL ? join(DIST_PATH, '../public') : RENDERER_DIST_PATH;
export const PRELOAD_PATH = join(PRELOAD_DIST_PATH, 'index.mjs');
export const HTML_PATH = join(RENDERER_DIST_PATH, 'index.html');
