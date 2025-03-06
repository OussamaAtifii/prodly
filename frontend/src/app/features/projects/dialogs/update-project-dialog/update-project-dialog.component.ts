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
import { Project } from '@features/projects/models/project.model';
import { ProjectService } from '@features/projects/services/project.service';

@Component({
  selector: 'app-update-project-dialog',
  imports: [MatDialogModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './update-project-dialog.component.html',
  styleUrl: './update-project-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProjectDialogComponent {
  private service = inject(ProjectService);

  data: { project: Project };

  constructor(@Inject(MAT_DIALOG_DATA) data: { project: Project }) {
    this.data = data;
    console.log(data);

    this.createProjectForm = new FormGroup({
      name: new FormControl<string>(this.data.project.name, [
        Validators.required,
      ]),
      color: new FormControl(this.data.project.color),
    });
  }

  createProjectForm: FormGroup;

  onSubmit() {
    console.log(this.createProjectForm.value);

    if (this.createProjectForm.invalid) return;

    const formData = this.createProjectForm.value;

    this.service.update(this.data.project.id, formData).subscribe({
      next: (project) => {
        console.log('Created project:', project);
      },
      error: (error) => console.log(error),
    });
  }
}
