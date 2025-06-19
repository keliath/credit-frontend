import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  constructor(private snackBar: MatSnackBar) {}

  public handleApiError(error: any, defaultMsg = 'Ocurrió un error'): void {
    let errorMessage = defaultMsg;
    if (error?.status === 400 && error.error) {
      if (error.error.errors) {
        errorMessage = Object.values(error.error.errors).flat().join(' ');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = 'Datos inválidos. Por favor, revise el formulario.';
      }
    } else if (error?.status === 0) {
      errorMessage = 'No se pudo conectar con el servidor. Intente más tarde.';
    }
    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: 'error-snackbar',
    });
  }
}
