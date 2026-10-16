import { createModuleFederationConfig } from '@module-federation/vite';

export default createModuleFederationConfig({
  name: 'people-listing',
  dts: false,
  filename: 'remoteEntry.js',
  exposes: {
    './PeopleApp': './src/PeopleApp.tsx',
  },
  shared: {
    react: {
      singleton: true,
    },
    'react/': {
      singleton: true,
    },
    "react-router": { singleton: true },
    "react-router/": { singleton: true },
  },
});
