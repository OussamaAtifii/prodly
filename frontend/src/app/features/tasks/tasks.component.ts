import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
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
import { InviteMemberDialogComponent } from '@features/invitation/dialogs/invite-member-dialog/invite-member-dialog.component';
import { InvitationService } from '@features/invitation/services/invitation.service';
import { Member } from '@features/invitation/models/member';
import { getAvatarText } from '@core/utils/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@features/auth/services/auth.service';

@Component({
  selector: 'app-tasks',
  imports: [
    DragDropModule,
    TaskComponent,
    AddSquareIconComponent,
    SpinnerComponent,
    MatTooltipModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent implements OnInit, OnDestroy {
  private projectService = inject(ProjectService);
  private tasksStore = inject(TasksStore);
  private taskService = inject(TaskService);
  private invitationService = inject(InvitationService);
  private authService = inject(AuthService);

  private readonly dialog = inject(MatDialog);

  projectId = input.required<string>();
  project = this.projectService.project;
  members = signal<Member[]>([]);

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

  userOwnProject = computed(() => {
    console.log(this.projectService.project()?.id);
    console.log(this.authService.user()?.id);
    return (
      this.projectService.project()?.userId === this.authService.user()?.id
    );
  });

  // Load tasks according to selected project id
  private loadTasks() {
    this.tasksStore.loadByProjectId(this.projectId());
  }

  private getMembers() {
    this.invitationService
      .getProjectMembers(Number(this.projectId()))
      .subscribe({
        next: (members) => {
          console.log(members);
          this.members.set(members);
        },
        error: (error) => console.log(error),
      });
  }

  getAvatarText(email: string) {
    return getAvatarText(email);
  }

  // Set the selected project and load its associated tasks
  private setProject() {
    this.projectService.setProject(
      this.projectService
        .projects()
        .find((project) => String(project.id) === this.projectId()) ?? null,
    );

    this.loadTasks();
    this.getMembers();
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

  openInviteMemberDialog() {
    this.dialog.open(InviteMemberDialogComponent);
  }
}
