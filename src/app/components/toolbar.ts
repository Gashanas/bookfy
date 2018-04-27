import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'bc-toolbar',
  template: `
    <md-toolbar style="background-color: white">
      <button md-icon-button (click)="openMenu.emit()">
        <md-icon>menu</md-icon>
      </button>
      <ng-content></ng-content>
    </md-toolbar>
  `
})
export class ToolbarComponent {
  @Output() openMenu = new EventEmitter();
}
