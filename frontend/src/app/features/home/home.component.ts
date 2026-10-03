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
        zoom: {
          enabled: false,
        },
      },

      colors: ['#3982F7', '#22C55E'],

      dataLabels: {
        enabled: false,
      },

      stroke: {
        curve: 'smooth',
        width: 2.5,
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.22,
          opacityTo: 0,
          stops: [0, 100],
        },
      },

      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },

      grid: {
        borderColor: '#EEF0F3',
        strokeDashArray: 4,

        xaxis: {
          lines: {
            show: false,
          },
        },

        yaxis: {
          lines: {
            show: true,
          },
        },
      },

      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },

        labels: {
          style: {
            colors: '#9CA3AF',
            fontSize: '12px',
          },
        },
      },

      yaxis: {
        min: 0,

        labels: {
          style: {
            colors: '#9CA3AF',
            fontSize: '12px',
          },
        },
      },

      tooltip: {
        theme: 'light',

        shared: true,
        intersect: false,

        y: {
          formatter: (value: number) => `${value} tasks`,
        },
      },

      legend: {
        position: 'top',
        horizontalAlign: 'right',

        fontSize: '13px',

        markers: {
          size: 5,
        },

        itemMargin: {
          horizontal: 10,
        },

        labels: {
          colors: '#6B7280',
        },
      },

      title: {
        text: undefined,
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
