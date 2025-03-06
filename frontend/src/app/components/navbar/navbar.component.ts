import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectItemComponent } from '@features/projects/components/project-item/project-item.component';
import { ProjectService } from '@features/projects/services/project.service';
import { HomeIconComponent } from '@shared/components/icons/home-icon/home-icon.component';
import { CreateProjectDialogComponent } from '@features/projects/dialogs/create-project-dialog/create-project-dialog.component';
import { AddIconComponent } from '@shared/components/icons/add-icon/add-icon.component';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { LogoutIconComponent } from '@icons/logout-icon/logout-icon.component';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '@features/auth/services/auth.service';
import { SettingsIconComponent } from '@icons/settings-icon/settings-icon.component';
import { NavItemComponent } from '../nav-item/nav-item.component';

@Component({
  selector: 'app-navbar',
  imports: [
    AddIconComponent,
    NavItemComponent,
    ProjectItemComponent,
    SpinnerComponent,
    LogoutIconComponent,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(true);
  projects = this.projectService.projects;

  routes = [
    { name: 'Dashboard', href: '/', icon: HomeIconComponent },
    { name: 'Settings', href: '/settings', icon: SettingsIconComponent },
  ];

  ngOnInit(): void {
    this.projectService.getUserProjects().subscribe({
      error: (error) => {
        console.error('Error fetching projects', error);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  openDialog() {
    this.dialog.open(CreateProjectDialogComponent);
  }

  logout() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent);

    confirmDialog.afterClosed().subscribe((value: boolean) => {
      if (value) {
        this.authService.logout().subscribe({
          next: () => {
            this.router.navigate(['/login']);
          },
          error: (error) => console.log(error),
        });
      }
    });
  }
}
