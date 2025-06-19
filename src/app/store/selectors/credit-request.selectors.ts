import { createSelector } from '@ngrx/store';
import {
  CreditRequestListResponse,
  CreditRequestResponse,
} from '../../models/credit-request.model';
import { CreditRequestState } from '../reducers/credit-request.reducer';

export const selectCreditRequestState = (state: any) => state.creditRequest;

export const selectCreditRequests = createSelector(
  selectCreditRequestState,
  (state: CreditRequestState) => state?.requests?.items ?? []
);

export const selectCreditRequestsPagination = createSelector(
  selectCreditRequestState,
  (state: CreditRequestState) => {
    const req = state?.requests;
    return req
      ? {
          page: req.page,
          size: req.size,
          totalCount: req.totalCount,
          totalPages: req.totalPages,
        }
      : { page: 1, size: 10, totalCount: 0, totalPages: 1 };
  }
);

export const selectSelectedRequest = createSelector(
  selectCreditRequestState,
  (state: CreditRequestState) => state.selectedRequest
);

export const selectCreditRequestLoading = createSelector(
  selectCreditRequestState,
  (state: CreditRequestState) => state.loading
);

export const selectCreditRequestError = createSelector(
  selectCreditRequestState,
  (state: CreditRequestState) => state.error
);

export const selectAllCreditRequests = createSelector(
  selectCreditRequestState,
  (state) => state.creditRequests
);

export const selectSelectedCreditRequest = createSelector(
  selectCreditRequestState,
  (state) => state.selectedCreditRequest
);

export const selectCreditRequestsByStatus = createSelector(
  selectAllCreditRequests,
  (creditRequests: CreditRequestResponse[], status: string) =>
    creditRequests.filter((cr) => cr.status === status)
);

export const selectPendingCreditRequests = createSelector(
  selectCreditRequests,
  (creditRequests: CreditRequestListResponse[]) =>
    creditRequests.filter(
      (cr: CreditRequestListResponse) => cr.status === 'PENDING'
    )
);

export const selectApprovedCreditRequests = createSelector(
  selectCreditRequests,
  (creditRequests: CreditRequestListResponse[]) =>
    creditRequests.filter(
      (cr: CreditRequestListResponse) => cr.status === 'APPROVED'
    )
);

export const selectRejectedCreditRequests = createSelector(
  selectCreditRequests,
  (creditRequests: CreditRequestListResponse[]) =>
    creditRequests.filter(
      (cr: CreditRequestListResponse) => cr.status === 'REJECTED'
    )
);
