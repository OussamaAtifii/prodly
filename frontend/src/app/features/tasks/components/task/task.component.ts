import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Task } from 'src/app/models/task.model';
import { MoreIconComponent } from '@icons/more-icon/more-icon.component';
import { PriorityBadgeComponent } from '../priority-badge/priority-badge.component';
import { MatMenuModule } from '@angular/material/menu';
import { DeleteIconComponent } from '../../../../shared/components/icons/delete-icon/delete-icon.component';
import { TaskService } from '@features/tasks/services/task.service';
import { TasksStore } from '@core/store/tasks.store';
import { UpdateIconComponent } from '../../../../shared/components/icons/update-icon/update-icon.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskDialogComponent } from '@features/tasks/dialogs/update-task-dialog/update-task-dialog.component';

@Component({
  selector: 'app-task',
  imports: [
    DragDropModule,
    PriorityBadgeComponent,
    MoreIconComponent,
    MatMenuModule,
    DeleteIconComponent,
    UpdateIconComponent,
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskComponent {
  private taskService = inject(TaskService);
  private tasksStore = inject(TasksStore);
  private readonly dialog = inject(MatDialog);

  task = input.required<Task>();

  deleteTask() {
    this.taskService.deleteTask(this.task().id).subscribe({
      next: (value) => {
        this.tasksStore.deleteTask(this.task());
      },
      error: (error) => console.log(error),
    });
  }

  updateTask() {
    this.dialog.open(UpdateTaskDialogComponent, {
      data: {
        task: this.task(),
      },
    });
  }
}
