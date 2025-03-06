import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Tasks } from '@models/task.model';

export const isUniqueValidator = (tasks: Tasks) => {
  return (control: AbstractControl): ValidationErrors | null => {
    const newTaskTitle = control.value as string;

    const exists = Object.values({ ...tasks })
      .flat()
      .find(
        (task) =>
          task.title.toLowerCase().trim() === newTaskTitle.toLowerCase().trim(),
      );

    return exists ? { notUnique: 'This task already exists' } : null;
  };
};
