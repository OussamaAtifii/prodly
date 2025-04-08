import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Invitation } from '@features/invitation/models/invitation';
import { InvitationService } from '@features/invitation/services/invitation.service';
import { ProjectService } from '@features/projects/services/project.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { PrintErrorComponent } from '@shared/components/print-error/print-error.component';

@Component({
  selector: 'app-invite-member-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    PrintErrorComponent,
  ],
  templateUrl: './invite-member-dialog.component.html',
  styleUrl: './invite-member-dialog.component.css',
})
export class InviteMemberDialogComponent {
  private projectService = inject(ProjectService);
  private invitationService = inject(InvitationService);
  private toast = inject(HotToastService);

  private readonly dialogRef = inject(
    MatDialogRef<InviteMemberDialogComponent>,
  );

  error = signal('');

  invitationForm = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
  });

  onSubmit() {
    if (this.invitationForm.invalid) return;
    const projectId = this.projectService.project()?.id as number;
    const email = this.invitationForm.get('email')?.value as string;

    const data: Invitation = {
      projectId,
      email,
    };

    this.invitationService.sendInvitation(data).subscribe({
      next: (value) => {
        this.dialogRef.close();
        this.toast.success('Invitation sent successfully!');
      },
      error: (error) => {
        this.error.set(error.error.message);
      },
    });
  }
}
