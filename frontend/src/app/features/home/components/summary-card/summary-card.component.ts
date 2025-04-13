import { Component, input } from '@angular/core';
import { SummaryItem } from '@core/models/summary.model';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-summary-card',
  imports: [SpinnerComponent],
  templateUrl: './summary-card.component.html',
})
export class SummaryCardComponent {
  title = input.required<string>();
  loading = input.required<boolean>();
  summary = input.required<SummaryItem>();
}
