import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateCreditRequestRequest,
  CreditRequestFilter,
  CreditRequestListResponse,
  CreditRequestResponse,
  PaginatedCreditRequests,
  UpdateCreditRequestStatusRequest,
} from '../models/credit-request.model';

@Injectable({
  providedIn: 'root',
})
export class CreditRequestService {
  private apiUrl = `${environment.apiUrl}/CreditRequest`;

  constructor(private http: HttpClient) {}

  getCreditRequests(
    filter?: CreditRequestFilter & { page?: number; size?: number }
  ): Observable<PaginatedCreditRequests> {
    let params = new HttpParams();
    if (filter?.status) {
      params = params.set('status', filter.status);
    }
    if (filter?.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter?.size) {
      params = params.set('size', filter.size.toString());
    }
    return this.http.get<PaginatedCreditRequests>(this.apiUrl, { params });
  }

  getCreditRequestById(id: string): Observable<CreditRequestResponse> {
    return this.http.get<CreditRequestResponse>(`${this.apiUrl}/${id}`);
  }

  createCreditRequest(
    request: CreateCreditRequestRequest
  ): Observable<CreditRequestResponse> {
    return this.http.post<CreditRequestResponse>(this.apiUrl, request);
  }

  updateCreditRequestStatus(
    id: string,
    request: UpdateCreditRequestStatusRequest
  ): Observable<CreditRequestResponse> {
    return this.http.put<CreditRequestResponse>(
      `${this.apiUrl}/${id}/status`,
      request
    );
  }

  getUserCreditRequests(): Observable<CreditRequestListResponse[]> {
    return this.http.get<CreditRequestListResponse[]>(
      `${this.apiUrl}/my-requests`
    );
  }

  getSuggestedStatus(monthlyIncome: number): 'Aprobado' | 'Rechazado' {
    return monthlyIncome >= 1500 ? 'Aprobado' : 'Rechazado';
  }

  // Simulated export
  exportToPdf(filter?: CreditRequestFilter): Observable<Blob> {
    return new Observable((observer) => {
      setTimeout(() => {
        const blob = new Blob(['PDF content'], { type: 'application/pdf' });
        observer.next(blob);
        observer.complete();
      }, 1000);
    });
  }

  exportToExcel(filter?: CreditRequestFilter): Observable<Blob> {
    return new Observable((observer) => {
      setTimeout(() => {
        const blob = new Blob(['Excel content'], {
          type: 'application/vnd.ms-excel',
        });
        observer.next(blob);
        observer.complete();
      }, 1000);
    });
  }
}
