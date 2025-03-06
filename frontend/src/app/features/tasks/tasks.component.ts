import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from '@features/projects/services/project.service';
import { CreateTaskDialogComponent } from '@features/tasks/dialogs/create-task-dialog/create-task-dialog.component';
import { AddSquareIconComponent } from '@shared/components/icons/add-square-icon/add-square-icon.component';
import { Task } from '@models/task.model';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TaskComponent } from './components/task/task.component';
import { TasksStore } from '@core/store/tasks.store';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-tasks',
  imports: [
    DragDropModule,
    TaskComponent,
    AddSquareIconComponent,
    SpinnerComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private tasksStore = inject(TasksStore);
  private taskService = inject(TaskService);

  private readonly dialog = inject(MatDialog);

  projectId = input.required<string>();
  project = this.projectService.project;

  constructor() {
    effect(() => this.setProject());
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  // Get tasks from tasks store
  get tasks() {
    return this.tasksStore.tasks();
  }

  // Get loading status from tasks store
  get loading() {
    return this.tasksStore.loading();
  }

  // Load tasks according to selected project id
  private loadTasks() {
    this.tasksStore.loadByProjectId(this.projectId());
  }

  // Set the selected project and load its associated tasks
  private setProject() {
    this.projectService.setProject(
      this.projectService
        .projects()
        .find((project) => String(project.id) === this.projectId()) ?? null,
    );

    this.loadTasks();
  }

  // Remove selected project when tasks page is destroyed
  ngOnDestroy() {
    this.projectService.setProject(null);
  }

  drop(event: CdkDragDrop<Task[]>) {
    const taskBeingMoved = event.previousContainer.data[event.previousIndex];
    const previousContainer =
      event.previousContainer.element.nativeElement.getAttribute('data-name');
    const taskMovedTo = event.container.element.nativeElement.getAttribute(
      'data-name',
    ) as 'todo' | 'process' | 'done';

    if (previousContainer !== taskMovedTo) {
      this.taskService
        .changeTaskStatus({
          id: taskBeingMoved.id,
          status: taskMovedTo,
        })
        .subscribe({
          error: (error) => {
            console.log(error);
          },
        });
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  openDialog() {
    this.dialog.open(CreateTaskDialogComponent);
  }
}
