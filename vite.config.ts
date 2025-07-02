import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron/simple';
import checker from 'vite-plugin-checker';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
    const isServe = command === 'serve';
    const isBuild = command === 'build';

    return {
        root: path.join(__dirname, 'src', 'renderer'),
        build: {
            outDir: path.join(__dirname, 'dist', 'renderer'),
        },
        resolve: {
            alias: {
                '@renderer': path.join(__dirname, 'src', 'renderer', 'src'),
                '@shared': path.join(__dirname, 'src', 'shared'),
            },
        },
        envDir: __dirname,
        plugins: [
            react(),
            checker({
                typescript: {
                    tsconfigPath: 'tsconfig.web.json',
                },
            }),
            electron({
                main: {
                    entry: path.join(__dirname, 'src', 'main', 'index.ts'),
                    vite: {
                        build: {
                            sourcemap: isServe,
                            minify: isBuild,
                            outDir: path.join(__dirname, 'dist', 'main'),
                        },
                        resolve: {
                            alias: {
                                '@main': path.join(__dirname, 'src', 'main'),
                                '@shared': path.join(__dirname, 'src', 'shared'),
                            },
                        },
                    },
                },
                preload: {
                    input: path.join(__dirname, 'src', 'preload', 'index.ts'),
                    vite: {
                        build: {
                            sourcemap: isServe ? 'inline' : undefined,
                            minify: isBuild,
                            outDir: path.join(__dirname, 'dist', 'preload'),
                            lib: {
                                entry: path.join(__dirname, 'src', 'preload', 'index.ts'),
                                formats: ['es'],
                            },
                        },
                        resolve: {
                            alias: {
                                '@main': path.join(__dirname, 'src', 'main'),
                                '@shared': path.join(__dirname, 'src', 'shared'),
                            },
                        },
                    },
                },
            }),
        ],
    };
});
