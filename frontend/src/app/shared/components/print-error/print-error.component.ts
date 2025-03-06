import { Component, input } from '@angular/core';

@Component({
  selector: 'app-print-error',
  imports: [],
  templateUrl: './print-error.component.html',
  styleUrl: './print-error.component.css',
})
export class PrintErrorComponent {
  control = input<any>();
}
