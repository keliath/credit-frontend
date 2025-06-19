import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './reducers/auth.reducer';
import {
  creditRequestReducer,
  CreditRequestState,
} from './reducers/credit-request.reducer';

export interface AppState {
  auth: AuthState;
  creditRequest: CreditRequestState;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  creditRequest: creditRequestReducer,
};
