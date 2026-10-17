import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-header',
  styleUrl: 'app-header.css',
  shadow: true,
})
export class AppHeader {
  @Prop() appTitle: string = 'People Listing Microfront';

  render() {
    return (
      <header class="app-header">
        <div class="logo">⚡ Stencil Web Component</div>
        <div class="title">{this.appTitle}</div>
      </header>
    );
  }
}
