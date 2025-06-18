import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { AppState } from '../store';
import * as AuthSelectors from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

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

        if (!requiredRoles || requiredRoles.includes(user.role)) {
          return true;
        }

        // Redirect to appropriate default route based on role
        if (user.role === 'Analyst') {
          return this.router.createUrlTree(['/credit-requests']);
        } else {
          return this.router.createUrlTree(['/my-credit-requests']);
        }
      })
    );
  }
}
