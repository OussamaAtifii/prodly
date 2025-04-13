import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Summary } from '@core/models/summary.model';
import { ProjectService } from '@features/projects/services/project.service';
import { TaskService } from '@features/tasks/services/task.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SummaryCardComponent } from './components/summary-card/summary-card.component';

@Component({
  selector: 'app-home',
  imports: [SpinnerComponent, NgApexchartsModule, SummaryCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private projectService = inject(ProjectService);
  private tasksService = inject(TaskService);
  public chartOptions: any;
  loading = signal(true);

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Created',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
          name: 'Completed',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
      ],
      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
        foreColor: '#333',
        background: '#f3f4f6',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.4,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      title: {
        text: 'Anual Task Statistics',
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#364153',
        },
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        labels: {
          style: {
            colors: '#555',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#555',
            fontSize: '12px',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: {
          colors: '#364153',
        },
      },
    };
  }

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

    this.tasksService.getStats().subscribe({
      next: (value) => {
        console.log(value);
        this.chartOptions.series[0].data = value.createdCount;
        this.chartOptions.series[1].data = value.completedCount;
      },
      error: (error) => console.log(error),
      complete: () => this.loading.set(false),
    });
  }
}
