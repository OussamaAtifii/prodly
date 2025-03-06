import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Summary } from '@core/models/summary.model';
import { ProjectService } from '@features/projects/services/project.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  imports: [SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private projectService = inject(ProjectService);
  loading = signal(true);

  summary = signal<Summary>({
    completed: { previous: 0, current: 0, percentage: 0 },
    inProcess: { previous: 0, current: 0, percentage: 0 },
    created: { previous: 0, current: 0, percentage: 0 },
  });

  ngOnInit(): void {
    this.projectService.getSummary().subscribe({
      next: (value) => this.summary.set(value),
      error: (error) => console.log(error),
      complete: () => this.loading.set(false),
    });
  }
}
