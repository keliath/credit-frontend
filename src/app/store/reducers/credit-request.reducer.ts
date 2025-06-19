import { createReducer, on } from '@ngrx/store';
import {
  CreditRequestResponse,
  PaginatedCreditRequests,
} from '../../models/credit-request.model';
import * as CreditRequestActions from '../actions/credit-request.actions';

export interface CreditRequestState {
  requests: PaginatedCreditRequests | null;
  selectedRequest: CreditRequestResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CreditRequestState = {
  requests: null,
  selectedRequest: null,
  loading: false,
  error: null,
};

export const creditRequestReducer = createReducer(
  initialState,

  // Load Credit Requests
  on(CreditRequestActions.loadCreditRequests, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CreditRequestActions.loadCreditRequestsSuccess, (state, { response }) => ({
    ...state,
    requests: response,
    loading: false,
    error: null,
  })),

  on(CreditRequestActions.loadCreditRequestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load User Credit Requests
  on(CreditRequestActions.loadUserCreditRequests, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    CreditRequestActions.loadUserCreditRequestsSuccess,
    (state, { requests }) => ({
      ...state,
      requests: {
        items: requests,
        page: 1,
        size: requests.length,
        totalCount: requests.length,
        totalPages: 1,
      },
      loading: false,
      error: null,
    })
  ),

  on(
    CreditRequestActions.loadUserCreditRequestsFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  ),

  // Load Credit Request by ID
  on(CreditRequestActions.loadCreditRequestById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    CreditRequestActions.loadCreditRequestByIdSuccess,
    (state, { request }) => ({
      ...state,
      selectedRequest: request,
      loading: false,
      error: null,
    })
  ),

  on(CreditRequestActions.loadCreditRequestByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Credit Request
  on(CreditRequestActions.createCreditRequest, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CreditRequestActions.createCreditRequestSuccess, (state, { request }) => ({
    ...state,
    requests: state.requests
      ? {
          ...state.requests,
          items: [...state.requests.items, request],
        }
      : null,
    loading: false,
    error: null,
  })),

  on(CreditRequestActions.createCreditRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Credit Request Status
  on(CreditRequestActions.updateCreditRequestStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(
    CreditRequestActions.updateCreditRequestStatusSuccess,
    (state, { request }) => ({
      ...state,
      requests: state.requests
        ? {
            ...state.requests,
            items: state.requests.items.map((r) =>
              r.id === request.id ? { ...r, ...request } : r
            ),
          }
        : null,
      selectedRequest:
        state.selectedRequest?.id === request.id
          ? request
          : state.selectedRequest,
      loading: false,
      error: null,
    })
  ),

  on(
    CreditRequestActions.updateCreditRequestStatusFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })
  )
);
