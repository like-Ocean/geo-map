import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  output: {
    cssModules: {
        auto: /.(m|module).(css|scss)$/,
        localIdentName: '[local]-[hash:base64:6]',
    },
},
});
