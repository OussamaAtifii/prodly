import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@features/projects/services/project.service';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { InvitationService } from './services/invitation.service';

@Component({
  selector: 'app-invitation',
  imports: [SpinnerComponent],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.css',
})
export class InvitationComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private invitationService = inject(InvitationService);
  private projectService = inject(ProjectService);

  token: string = '';
  error = signal('');
  loading = signal(true);

  ngOnInit(): void {
    const subscription = this.activatedRoute.queryParams.subscribe({
      next: (params) => {
        this.token = params['token'];
        console.log(this.token);
      },
    });

    this.invitationService.validInvitation(this.token).subscribe({
      next: (value: { projectId: number }) => {
        console.log(value.projectId);
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['projects', value.projectId, 'tasks']);
        }, 3000);

        this.projectService.getUserProjects().subscribe({
          next: (projects) => console.log('User projects loaded', projects),
          error: (err) => console.error('Error loading projects', err),
        });
      },
      error: (error) => {
        console.log(error);
        this.error.set(error.error.message);
        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
