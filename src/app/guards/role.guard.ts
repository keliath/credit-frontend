import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store';
import * as AuthSelectors from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(AuthSelectors.selectUser).pipe(
      take(1),
      map((user) => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }

        const route = this.router.config.find(
          (r) => r.path === this.router.url.split('/')[1]
        );
        const requiredRoles = route?.data?.['roles'] as string[];

        if (
          !requiredRoles ||
          requiredRoles
            .map((r) => r.toLowerCase())
            .includes(user.role.toLowerCase())
        ) {
          return true;
        }

        this.snackBar.open(
          'Acceso denegado: no tienes permisos para acceder a esta página.',
          'Cerrar',
          {
            duration: 3500,
            panelClass: 'error-snackbar',
          }
        );
        return this.router.createUrlTree(['/dashboard']);
      })
    );
  }
}
