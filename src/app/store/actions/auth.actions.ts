import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: { email: string; password: string } }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User; token: string }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ userData: { username: string; email: string; password: string } }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ user: User; token: string }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');
export const logoutSuccess = createAction('[Auth] Logout Success');

// Load User from Storage
export const loadUserFromStorage = createAction(
  '[Auth] Load User From Storage'
);
export const loadUserFromStorageSuccess = createAction(
  '[Auth] Load User From Storage Success',
  props<{ user: User }>()
);

// Whoami
export const whoami = createAction('[Auth] Whoami');

export const whoamiSuccess = createAction(
  '[Auth] Whoami Success',
  props<{ user: User; token: string }>()
);

export const whoamiFailure = createAction(
  '[Auth] Whoami Failure',
  props<{ error: string }>()
);
