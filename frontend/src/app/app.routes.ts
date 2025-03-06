import { Routes } from '@angular/router';
import { TasksComponent } from './features/tasks/tasks.component';
import { MainLayoutComponent } from '@core/layouts/main-layout/main-layout.component';
import { HomeComponent } from '@features/home/home.component';
import { authGuard } from '@features/auth/guards/auth.guard';
import { LoginComponent } from '@features/auth/login/login.component';
import { RegisterComponent } from '@features/auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'projects/:projectId/tasks',
        component: TasksComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
];
