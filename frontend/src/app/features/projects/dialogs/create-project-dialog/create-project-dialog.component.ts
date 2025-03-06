import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Project } from '@features/projects/models/project.model';
import { ProjectService } from '@features/projects/services/project.service';
import { PrintErrorComponent } from '../../../../shared/components/print-error/print-error.component';
import { getRandomColor } from '@core/utils/getRandomColor';
@Component({
  selector: 'app-create-project-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    PrintErrorComponent,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProjectDialogComponent {
  private service = inject(ProjectService);

  createProjectForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
    ]),
    color: new FormControl(getRandomColor()),
  });

  onSubmit() {
    if (this.createProjectForm.invalid) {
      console.log('Is invalid');
      return;
    }

    const formData = this.createProjectForm.value;

    const project: Project = {
      id: Math.random() * 1000,
      name: formData.name ?? '',
      color: formData.color ?? '',
    };

    this.service.create(project).subscribe({
      next: (project) => {
        console.log('Created project:', project);
      },
      error: (error) => console.log(error),
    });
  }

  get name() {
    return this.createProjectForm.get('name') as FormControl;
  }
}
