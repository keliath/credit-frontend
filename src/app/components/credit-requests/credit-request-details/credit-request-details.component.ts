import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  CreditRequestResponse,
  CreditRequestStatus,
} from '../../../models/credit-request.model';
import * as CreditRequestActions from '../../../store/actions/credit-request.actions';
import * as CreditRequestSelectors from '../../../store/selectors/credit-request.selectors';

@Component({
  selector: 'app-credit-request-details',
  templateUrl: './credit-request-details.component.html',
  styleUrls: ['./credit-request-details.component.scss'],
})
export class CreditRequestDetailsComponent implements OnInit {
  request$: Observable<CreditRequestResponse | null>;
  loading$: Observable<boolean>;
  error$: Observable<any>;

  constructor(private route: ActivatedRoute, private store: Store) {
    this.request$ = this.store.select(
      CreditRequestSelectors.selectSelectedRequest
    );
    this.loading$ = this.store.select(CreditRequestSelectors.selectLoading);
    this.error$ = this.store.select(CreditRequestSelectors.selectError);
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.dispatch(CreditRequestActions.getCreditRequest({ id }));
    }
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
