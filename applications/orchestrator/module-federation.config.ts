import { createModuleFederationConfig } from '@module-federation/vite';

export default createModuleFederationConfig({
  name: 'orchestrator',
  manifest: true,
  dts: false,
  remotes: {
    peopleListMicroFront: {
      type: "module",
      name: 'remote',
      entry: 'http://localhost:5000/remoteEntry.js',
    }
  },
  filename: 'remoteEntry.js',
  shared: {
    react: {
      singleton: true,
    },
    'react/': {
      singleton: true,
    },
  },
});
