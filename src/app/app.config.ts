import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthEffects } from './store/effects/auth.effects';
import { CreditRequestEffects } from './store/effects/credit-request.effects';
import { authReducer } from './store/reducers/auth.reducer';
import { creditRequestReducer } from './store/reducers/credit-request.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideStore({
      creditRequest: creditRequestReducer,
      auth: authReducer,
    }),
    provideEffects([CreditRequestEffects, AuthEffects]),
    provideStoreDevtools({
      maxAge: 25, // Opcional: cuántas acciones mantener en el historial
      logOnly: false, // true en producción para solo lectura
    }),
    importProvidersFrom(MatSnackBarModule),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      },
    },
  ],
};
