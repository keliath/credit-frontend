import { createAction, props } from '@ngrx/store';
import {
  CreateCreditRequestRequest,
  CreditRequestFilter,
  CreditRequestListResponse,
  CreditRequestResponse,
  CreditRequestStatus,
  PaginatedCreditRequests,
  UpdateCreditRequestStatusRequest,
} from '../../models/credit-request.model';

export const loadCreditRequests = createAction(
  '[Credit Request] Load Credit Requests',
  props<{ filter?: CreditRequestFilter }>()
);

export const loadCreditRequestsSuccess = createAction(
  '[Credit Request] Load Credit Requests Success',
  props<{ response: PaginatedCreditRequests }>()
);

export const loadCreditRequestsFailure = createAction(
  '[Credit Request] Load Credit Requests Failure',
  props<{ error: string }>()
);

export const loadUserCreditRequests = createAction(
  '[Credit Request] Load User Credit Requests'
);

export const loadUserCreditRequestsSuccess = createAction(
  '[Credit Request] Load User Credit Requests Success',
  props<{ requests: CreditRequestListResponse[] }>()
);

export const loadUserCreditRequestsFailure = createAction(
  '[Credit Request] Load User Credit Requests Failure',
  props<{ error: any }>()
);

export const loadCreditRequestById = createAction(
  '[Credit Request] Load Credit Request by ID',
  props<{ id: string }>()
);

export const loadCreditRequestByIdSuccess = createAction(
  '[Credit Request] Load Credit Request by ID Success',
  props<{ request: CreditRequestResponse }>()
);

export const loadCreditRequestByIdFailure = createAction(
  '[Credit Request] Load Credit Request by ID Failure',
  props<{ error: string }>()
);

export const createCreditRequest = createAction(
  '[Credit Request] Create Credit Request',
  props<{ request: CreateCreditRequestRequest }>()
);

export const createCreditRequestSuccess = createAction(
  '[Credit Request] Create Credit Request Success',
  props<{ request: CreditRequestListResponse }>()
);

export const createCreditRequestFailure = createAction(
  '[Credit Request] Create Credit Request Failure',
  props<{ error: string }>()
);

export const updateCreditRequestStatus = createAction(
  '[Credit Request] Update Credit Request Status',
  props<{ id: string; request: UpdateCreditRequestStatusRequest }>()
);

export const updateCreditRequestStatusSuccess = createAction(
  '[Credit Request] Update Credit Request Status Success',
  props<{ request: CreditRequestResponse }>()
);

export const updateCreditRequestStatusFailure = createAction(
  '[Credit Request] Update Credit Request Status Failure',
  props<{ error: string }>()
);

export const getCreditRequest = createAction(
  '[Credit Request] Get Credit Request',
  props<{ id: string }>()
);

export const getCreditRequestSuccess = createAction(
  '[Credit Request] Get Credit Request Success',
  props<{ request: CreditRequestResponse }>()
);

export const getCreditRequestFailure = createAction(
  '[Credit Request] Get Credit Request Failure',
  props<{ error: any }>()
);

export const exportCreditRequests = createAction(
  '[Credit Request] Export Credit Requests',
  props<{ format: 'pdf' | 'excel'; status?: CreditRequestStatus }>()
);

export const exportCreditRequestsSuccess = createAction(
  '[Credit Request] Export Credit Requests Success'
);

export const exportCreditRequestsFailure = createAction(
  '[Credit Request] Export Credit Requests Failure',
  props<{ error: any }>()
);

export const getCreditRequestById = createAction(
  '[Credit Request] Get Credit Request By ID',
  props<{ id: string }>()
);
export const getCreditRequestByIdSuccess = createAction(
  '[Credit Request] Get Credit Request By ID Success',
  props<{ creditRequest: CreditRequestResponse }>()
);
export const getCreditRequestByIdFailure = createAction(
  '[Credit Request] Get Credit Request By ID Failure',
  props<{ error: string }>()
);

export const clearSelectedCreditRequest = createAction(
  '[Credit Request] Clear Selected Credit Request'
);
