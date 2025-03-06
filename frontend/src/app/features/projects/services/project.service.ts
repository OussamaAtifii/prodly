import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { Subject, tap } from 'rxjs';
import { Summary } from 'src/app/core/models/summary.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private API_URL = `${environment.API_URL}`;
  private httpClient = inject(HttpClient);
  private _projects = signal<Project[]>([]);
  private _project = signal<Project | null>(null);

  projects = this._projects;
  project = this._project;

  getUserProjects() {
    return this.httpClient
      .get<Project[]>(`${this.API_URL}/projects`, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (value) => {
            this._projects.set(value);
            console.log(value);
          },
        }),
      );
  }

  getSummary() {
    return this.httpClient.get<Summary>(`${this.API_URL}/projects/summary`, {
      withCredentials: true,
    });
  }

  create(project: Project) {
    return this.httpClient
      .post<Project>(`${this.API_URL}/projects`, project, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (value) => {
            this._projects.set([...this._projects(), value]);
          },
        }),
      );
  }

  update(projectId: number, projectData: Partial<Omit<Project, 'id'>>) {
    return this.httpClient
      .patch<Project>(`${this.API_URL}/projects/${projectId}`, projectData, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (value) => {
            console.log(value);
            this._projects.set(
              this._projects().map((project) =>
                project.id === projectId ? value : project,
              ),
            );
          },
        }),
      );
  }

  deleteProject(projectId: number) {
    return this.httpClient
      .delete(`${this.API_URL}/projects/${projectId}`, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: () => {
            this._projects.set(
              this._projects().filter((project) => project.id !== projectId),
            );
          },
        }),
      );
  }

  setProject(project: Project | null) {
    console.log('Setting project', project);
    this._project.set(project);
  }
}
