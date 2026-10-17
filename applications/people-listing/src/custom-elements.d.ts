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
