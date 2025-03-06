import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-priority-badge',
  imports: [],
  templateUrl: './priority-badge.component.html',
  styleUrl: './priority-badge.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityBadgeComponent {
  priority = input.required<Task['priority']>();

  color = computed(() => {
    switch (this.priority()) {
      case 'low':
        return '#66B97F';

      case 'medium':
        return '#D58D49';

      case 'high':
        return '#D8727D';

      default:
        return '#D58D49';
    }
  });

  formattedPriority = computed(() => {
    return this.priority().charAt(0).toUpperCase() + this.priority().slice(1);
  });
}
