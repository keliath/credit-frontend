import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import * as AuthSelectors from '../selectors/auth.selectors';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) => {
            const user = {
              username: response.username,
              email: response.email,
              role: response.role,
            };
            return AuthActions.loginSuccess({
              user,
              token: response.token,
            });
          }),
          catchError((error) => {
            let errorMessage = 'Error al iniciar sesión';

            if (error.status === 401) {
              errorMessage =
                'Credenciales inválidas. Por favor, verifique su email y contraseña.';
            } else if (error.status === 0) {
              errorMessage =
                'No se pudo conectar con el servidor. Por favor, intente más tarde.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ user, token }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  whoami$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.whoami),
      withLatestFrom(this.store.select(AuthSelectors.selectUser)),
      mergeMap(([_, currentUser]) => {
        if (currentUser) {
          const token = localStorage.getItem('token') || '';
          return of(AuthActions.whoamiSuccess({ user: currentUser, token }));
        }
        return this.authService.whoami().pipe(
          map((response: any) => {
            const { token, username, email, role } = response;
            const user = { username, email, role };
            return AuthActions.whoamiSuccess({ user, token });
          }),
          catchError((error) => {
            this.authService.logout();
            return of(AuthActions.whoamiFailure({ error: error.message }));
          })
        );
      })
    )
  );

  whoamiFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.whoamiFailure),
        tap(() => {
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.authService.logout();
      }),
      map(() => AuthActions.logoutSuccess()),
      tap(() => {
        this.router.navigate(['/login']);
      })
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap(({ userData }) =>
        this.authService.register(userData).pipe(
          map((response) => {
            const user = {
              username: response.username,
              email: response.email,
              role: response.role,
            };
            return AuthActions.registerSuccess({
              user,
              token: response.token,
            });
          }),
          catchError((error) => {
            let errorMessage = 'Error al registrar usuario';

            if (error.status === 400) {
              errorMessage =
                'Datos de registro inválidos. Por favor, verifique la información.';
            } else if (error.status === 409) {
              errorMessage =
                'El email ya está registrado. Por favor, use otro email.';
            } else if (error.status === 0) {
              errorMessage =
                'No se pudo conectar con el servidor. Por favor, intente más tarde.';
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }

            return of(AuthActions.registerFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(({ user }) => {
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );
}
