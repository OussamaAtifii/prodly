import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TasksStore } from '@core/store/tasks.store';
import { isUniqueValidator } from '@core/utils/validators/is-task-unique.validator';
import { Priorities } from '@features/tasks/models/priorities.model';
import { TaskService } from '@features/tasks/services/task.service';
import { Task } from '@models/task.model';
import { PrintErrorComponent } from '@shared/components/print-error/print-error.component';

@Component({
  selector: 'app-create-task-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    PrintErrorComponent,
  ],
  templateUrl: './create-task-dialog.component.html',
  styleUrl: './create-task-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskDialogComponent {
  private taskService = inject(TaskService);
  private tasksStore = inject(TasksStore);

  priorities: Priorities[] = [
    { value: 'low', viewValue: 'Low' },
    { value: 'medium', viewValue: 'Medium' },
    { value: 'high', viewValue: 'High' },
  ];

  createTaskForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      // Validate if there is a task with the same title
      isUniqueValidator(this.tasksStore.tasks()),
    ]),
    description: new FormControl<string>(''),
    priority: new FormControl(this.priorities[0].value),
  });

  onSubmit() {
    const formData = this.createTaskForm.value;

    const taskData = {
      id: Math.random() * 1000,
      title: formData.title ?? '',
      description: formData.description ?? '',
      priority: formData.priority ?? 'low',
      status: 'todo' as Task['status'],
      completed: false,
    };

    this.taskService.createTask(taskData).subscribe({
      next: (response) => {
        console.log(response);
        this.tasksStore.addTask({ ...taskData, id: response.id });
      },
      error: (error) => {
        console.log(error.error.message || 'Error while creating task');
      },
    });
  }
}
