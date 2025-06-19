import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AppState } from '../store';
import * as AuthActions from '../store/actions/auth.actions';
import * as AuthSelectors from '../store/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return combineLatest([
      this.store.select(AuthSelectors.selectUser),
      this.store.select((state) => state.auth.loading),
    ]).pipe(
      take(1),
      switchMap(([user, loading]) => {
        const token = localStorage.getItem('token');
        if (user) {
          return of(true);
        }
        if (!token) {
          return of(this.router.createUrlTree(['/login']));
        }
        if (loading) {
          return of(false);
        }
        this.store.dispatch(AuthActions.whoami());
        return this.store.select(AuthSelectors.selectUser).pipe(
          filter((u) => !!u),
          take(1),
          map(() => true)
        );
      })
    );
  }
}
