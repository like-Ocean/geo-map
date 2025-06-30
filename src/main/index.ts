import { DEV_SERVER_URL, HTML_PATH, PRELOAD_PATH, VITE_PUBLIC_PATH } from './url';
import { app, BrowserWindow, screen } from 'electron';
import { join } from 'path';

export let win: BrowserWindow | null = null;

const createWindow = async () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    const isDev = process.env.NODE_ENV !== 'development';

    win = new BrowserWindow({
        title: 'geo-map',
        icon: join(VITE_PUBLIC_PATH, 'vite.svg'),
        width: isDev ? 1280 : width,
        height: isDev ? 720 : height,
        frame: true,
        autoHideMenuBar: true,
        // fullscreen: process.env.NODE_ENV !== 'development',
        webPreferences: {
            preload: PRELOAD_PATH,
            sandbox: false,
        },
    });

    if (DEV_SERVER_URL) await win.loadURL(DEV_SERVER_URL);
    else await win.loadFile(HTML_PATH);
};

app.commandLine.appendSwitch('--no-sandbox');

app.whenReady().then(async () => {
    createWindow();
});

app.on('window-all-closed', () => {
    win = null;
    app.quit();
});

app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
});

app.on('activate', async () => {
    const allWindows = BrowserWindow.getAllWindows();
    if (allWindows.length) allWindows[0].focus();
    else await createWindow();
});
