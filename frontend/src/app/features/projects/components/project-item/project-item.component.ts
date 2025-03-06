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
  ],
  templateUrl: './project-item.component.html',
  styleUrl: './project-item.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectItemComponent {
  private projectService = inject(ProjectService);
  readonly dialog = inject(MatDialog);

  project = input.required<Project>();

  setProject() {
    this.projectService.setProject(this.project());
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
    console.log('SE HACE EL CAMBIO');
    console.log(this.projectService.project()?.id);
    return this.projectService.project()?.id === this.project().id;
  });
}
