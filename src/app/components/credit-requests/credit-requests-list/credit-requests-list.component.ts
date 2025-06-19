import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CreditRequestListResponse,
  CreditRequestStatus,
} from '../../../models/credit-request.model';
import { ErrorHandlerService } from '../../../services/error-handler.service';
import * as CreditRequestActions from '../../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../../store/selectors/credit-request.selectors';

@Component({
  selector: 'app-credit-requests-list',
  templateUrl: './credit-requests-list.component.html',
  styleUrls: ['./credit-requests-list.component.scss'],
})
export class CreditRequestsListComponent implements OnInit {
  requests$: Observable<CreditRequestListResponse[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  selectedStatus: CreditRequestStatus | undefined;

  constructor(private store: Store, private errorHandler: ErrorHandlerService) {
    this.requests$ = this.store.select(
      CreditRequestSelectors.selectAllRequests
    );
    this.loading$ = this.store.select(CreditRequestSelectors.selectLoading);
    this.error$ = this.store.select(CreditRequestSelectors.selectError);
  }

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.store.dispatch(
      CreditRequestActions.loadCreditRequests({ status: this.selectedStatus })
    );
  }

  onStatusChange(status: CreditRequestStatus | undefined): void {
    this.selectedStatus = status;
    this.loadRequests();
  }

  exportToPdf(): void {
    this.store.dispatch(
      CreditRequestActions.exportCreditRequests({
        format: 'pdf',
        status: this.selectedStatus,
      })
    );
  }

  exportToExcel(): void {
    this.store.dispatch(
      CreditRequestActions.exportCreditRequests({
        format: 'excel',
        status: this.selectedStatus,
      })
    );
  }

  getStatusClass(status: CreditRequestStatus): string {
    switch (status) {
      case CreditRequestStatus.Pending:
        return 'status-pending';
      case CreditRequestStatus.Approved:
        return 'status-approved';
      case CreditRequestStatus.Rejected:
        return 'status-rejected';
      default:
        return '';
    }
  }
}
