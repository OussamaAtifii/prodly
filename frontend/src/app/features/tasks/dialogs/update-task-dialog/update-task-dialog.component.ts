import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TasksStore } from '@core/store/tasks.store';
import { TaskService } from '@features/tasks/services/task.service';
import { Task } from '@models/task.model';
import { PrintErrorComponent } from '@shared/components/print-error/print-error.component';

@Component({
  selector: 'app-update-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    PrintErrorComponent,
  ],
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTaskDialogComponent {
  private taskService = inject(TaskService);
  private tasksStore = inject(TasksStore);

  data: { task: Task };
  updateTaskForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) data: { task: Task }) {
    this.data = data;

    this.updateTaskForm = new FormGroup({
      title: new FormControl<string>(data.task.title, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      description: new FormControl<string>(this.data.task.description),
      priority: new FormControl<'low' | 'medium' | 'high'>(
        this.data.task.priority,
      ),
    });
  }

  priorities: any = [
    { value: 'low', viewValue: 'Low' },
    { value: 'medium', viewValue: 'Medium' },
    { value: 'high', viewValue: 'High' },
  ];

  onSubmit() {
    if (this.updateTaskForm.invalid) return;

    const formData = this.updateTaskForm.value;

    console.log(formData);
    this.taskService.updateTask(this.data.task.id, formData).subscribe({
      next: (value) => console.log(value),
      error: (error) => console.log(error),
    });
  }
}
