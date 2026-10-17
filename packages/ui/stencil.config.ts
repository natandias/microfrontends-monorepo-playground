import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'repo-ui',
  srcDir: 'src/components',
  tsconfig: 'tsconfig.stencil.json',
  outputTargets: [
    {
      type: 'dist-custom-elements',
      dir: 'dist/components',
    },
  ],
};
