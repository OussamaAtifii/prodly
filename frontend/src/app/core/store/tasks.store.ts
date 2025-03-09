import { inject } from '@angular/core';
import { TaskService } from '@features/tasks/services/task.service';
import { Task, Tasks, TaskUpdateStatus } from '@models/task.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { Router } from '@angular/router';

type TasksState = {
  tasks: Tasks;
  loading: boolean;
};

const initialState: TasksState = {
  tasks: {
    todo: [],
    process: [],
    done: [],
  },
  loading: false,
};

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (store, tasksService = inject(TaskService), router = inject(Router)) => ({
      addTask(task: Task) {
        patchState(store, (state) => ({
          tasks: {
            ...state.tasks,
            todo: [task, ...state.tasks.todo],
          },
        }));
      },

      loadByProjectId: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((projectId) =>
            tasksService.getProjectTasks(Number(projectId)).pipe(
              tapResponse({
                next: (tasks: Tasks) => {
                  patchState(store, {
                    tasks: {
                      todo: tasks.todo ?? [],
                      process: tasks.process ?? [],
                      done: tasks.done ?? [],
                    },
                    loading: false,
                  });
                },
                error: () => {
                  router.navigate(['/']);
                },
              }),
            ),
          ),
        ),
      ),

      deleteTask(task: Task) {
        patchState(store, (state) => ({
          tasks: {
            ...state.tasks,
            [task.status]: state.tasks[task.status].filter(
              (t) => t.id !== task.id,
            ),
          },
        }));
      },
    }),
  ),
);
