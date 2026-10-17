import { defineCustomElement as defineAppHeader } from "../dist/components/app-header.js";

// Register custom element automatically in browser environment
if (typeof window !== "undefined") {
  defineAppHeader();
}

export { defineAppHeader };
export * from "./Button";


import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'app-header': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'app-title'?: string;
          appTitle?: string;
        },
        HTMLElement
      >;
    }
  }
}
