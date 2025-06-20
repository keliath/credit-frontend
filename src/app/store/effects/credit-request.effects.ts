import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { CreditRequestListResponse } from '../../models/credit-request.model';
import { CreditRequestService } from '../../services/credit-request.service';
import * as CreditRequestActions from '../actions/credit-request.actions';

@Injectable()
export class CreditRequestEffects {
  loadCreditRequests$;
  loadCreditRequestById$;
  loadUserCreditRequests$;
  createCreditRequest$;
  updateCreditRequestStatus$;
  getCreditRequest$;
  exportCreditRequests$;

  constructor(
    private actions$: Actions,
    private creditRequestService: CreditRequestService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loadCreditRequests$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.loadCreditRequests),
        mergeMap(({ filter }) =>
          this.creditRequestService.getCreditRequests(filter).pipe(
            map((response) =>
              CreditRequestActions.loadCreditRequestsSuccess({ response })
            ),
            catchError((error) =>
              of(
                CreditRequestActions.loadCreditRequestsFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      )
    );

    this.loadCreditRequestById$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.loadCreditRequestById),
        mergeMap(({ id }) =>
          this.creditRequestService.getCreditRequestById(id).pipe(
            map((request) =>
              CreditRequestActions.loadCreditRequestByIdSuccess({ request })
            ),
            catchError((error) =>
              of(
                CreditRequestActions.loadCreditRequestByIdFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      )
    );

    this.loadUserCreditRequests$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.loadUserCreditRequests),
        mergeMap(() =>
          this.creditRequestService.getUserCreditRequests().pipe(
            map((requests) =>
              CreditRequestActions.loadUserCreditRequestsSuccess({ requests })
            ),
            catchError((error) =>
              of(CreditRequestActions.loadUserCreditRequestsFailure({ error }))
            )
          )
        )
      )
    );

    this.createCreditRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.createCreditRequest),
        mergeMap(({ request }) =>
          this.creditRequestService.createCreditRequest(request).pipe(
            map((newRequest) => {
              const listResponse: CreditRequestListResponse = {
                id: newRequest.id,
                userId: newRequest.userId,
                user: newRequest.user,
                amount: newRequest.amount,
                purpose: newRequest.purpose,
                status: newRequest.status,
                createdAt: newRequest.createdAt,
                updatedAt: newRequest.updatedAt,
                termInMonths: newRequest.termInMonths,
                monthlyIncome: newRequest.monthlyIncome,
                workSeniorityYears: newRequest.workSeniorityYears,
                rejectionReason: newRequest.rejectionReason,
                approvedBy: newRequest.approvedBy,
                approvedAt: newRequest.approvedAt,
              };
              return CreditRequestActions.createCreditRequestSuccess({
                request: listResponse,
              });
            }),
            catchError((error) => {
              return of(
                CreditRequestActions.createCreditRequestFailure({
                  error,
                })
              );
            })
          )
        )
      )
    );

    this.updateCreditRequestStatus$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.updateCreditRequestStatus),
        mergeMap(({ id, request }) =>
          this.creditRequestService.updateCreditRequestStatus(id, request).pipe(
            map((updatedRequest) =>
              CreditRequestActions.updateCreditRequestStatusSuccess({
                request: updatedRequest,
              })
            ),
            catchError((error) =>
              of(
                CreditRequestActions.updateCreditRequestStatusFailure({
                  error: error.message,
                })
              )
            )
          )
        )
      )
    );

    this.getCreditRequest$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.getCreditRequest),
        mergeMap(({ id }) =>
          this.creditRequestService.getCreditRequestById(id).pipe(
            map((request) =>
              CreditRequestActions.getCreditRequestSuccess({ request })
            ),
            catchError((error) =>
              of(CreditRequestActions.getCreditRequestFailure({ error }))
            )
          )
        )
      )
    );

    this.exportCreditRequests$ = createEffect(() =>
      this.actions$.pipe(
        ofType(CreditRequestActions.exportCreditRequests),
        mergeMap(({ format, status }) =>
          (format === 'pdf'
            ? this.creditRequestService.exportToPdf({ status })
            : this.creditRequestService.exportToExcel({ status })
          ).pipe(
            tap((blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              const timestamp = new Date().toISOString().split('T')[0];
              const statusFilter = status ? `-${status.toLowerCase()}` : '';
              link.download = `credit-requests${statusFilter}-${timestamp}.${format}`;
              link.click();
              window.URL.revokeObjectURL(url);

              this.snackBar.open(
                `Export to ${format.toUpperCase()} completed successfully!`,
                'Close',
                {
                  duration: 3000,
                  panelClass: 'success-snackbar',
                }
              );
            }),
            map(() => CreditRequestActions.exportCreditRequestsSuccess()),
            catchError((error) => {
              this.snackBar.open(
                `Export failed: ${error.message || 'Unknown error'}`,
                'Close',
                {
                  duration: 5000,
                  panelClass: 'error-snackbar',
                }
              );
              return of(
                CreditRequestActions.exportCreditRequestsFailure({ error })
              );
            })
          )
        )
      )
    );
  }
}
