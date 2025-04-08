import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { MoreIconComponent } from '@shared/components/icons/more-icon/more-icon.component';
import { ProjectService } from '@features/projects/services/project.service';
import { Project } from '@features/projects/models/project.model';
import { DeleteIconComponent } from '@icons/delete-icon/delete-icon.component';
import { MatDialog } from '@angular/material/dialog';
import { UpdateProjectDialogComponent } from '@features/projects/dialogs/update-project-dialog/update-project-dialog.component';
import { UpdateIconComponent } from '@icons/update-icon/update-icon.component';
import { AuthService } from '@features/auth/services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectSocketService } from '@features/projects/services/project-socket.service';

@Component({
  selector: 'app-project-item',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    RouterLink,
    MoreIconComponent,
    NgClass,
    DeleteIconComponent,
    UpdateIconComponent,
    MatTooltipModule,
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectItemComponent {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private projectSocketService = inject(ProjectSocketService);

  readonly dialog = inject(MatDialog);

  project = input.required<Project>();
  actualProject = this.projectService.project();

  setProject() {
    this.projectSocketService.leaveProjectRoom(Number(this.actualProject?.id));
    this.projectService.setProject(this.project());
    this.projectSocketService.joinProjectRoom(this.project().id);
  }

  deleteProject() {
    const projectId = this.project().id;

    this.projectService.deleteProject(projectId).subscribe({
      next: () => console.log('Borrado correctamebte'),
      error: (error) => console.error('Error al borrar', error),
    });
  }

  updateProject() {
    this.dialog.open(UpdateProjectDialogComponent, {
      data: {
        project: this.project(),
      },
    });
  }

  isSelected = computed(() => {
    return this.projectService.project()?.id === this.project().id;
  });

  userOwnProject = computed(() => {
    return this.project().userId === this.authService.user()?.id;
  });
}
