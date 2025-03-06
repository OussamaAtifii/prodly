import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const router = inject(Router);

  if (
    request.url === `${environment.API_URL}/login` ||
    request.url === `${environment.API_URL}/register`
  ) {
    return next(request);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log(error.status);
      if (error.status === 401) {
        console.log('Unauthorized request - 401 error:', error);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
}
