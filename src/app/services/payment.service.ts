import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Payment, 
  PaymentRequest, 
  PaymentResponse,
  PaginatedResponse 
} from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private apiService: ApiService) {}

  // ✅ REQUIRED BY userdashboard.component.ts
  getRecentPayments(limit: number = 10): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(`/payments/recent?limit=${limit}`);
  }

  getUpcomingPayments(): Observable<Payment[]> {
    return this.apiService.get<Payment[]>('/payments/upcoming');
  }

  // Existing methods
  makePayment(paymentData: PaymentRequest): Observable<PaymentResponse> {
    return this.apiService.post<PaymentResponse>('/payments', paymentData);
  }

  getPaymentById(paymentId: string): Observable<Payment> {
    return this.apiService.get<Payment>(`/payments/${paymentId}`);
  }

  getPaymentReceipt(paymentId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/payments/${paymentId}/receipt`);
  }

  getPayments(filters?: any): Observable<PaginatedResponse<Payment>> {
    return this.apiService.get<PaginatedResponse<Payment>>('/payments', filters);
  }

  getPaymentsByProperty(propertyId: string, filters?: any): Observable<PaginatedResponse<Payment>> {
    const params = { propertyId, ...filters };
    return this.apiService.get<PaginatedResponse<Payment>>('/payments/property', params);
  }

  getPaymentSchedule(propertyId: string): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(`/payments/schedule/${propertyId}`);
  }

  calculateLateFee(paymentId: string): Observable<{ lateFee: number }> {
    return this.apiService.get<{ lateFee: number }>(`/payments/${paymentId}/late-fee`);
  }

  generateInvoice(paymentId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/payments/${paymentId}/invoice`);
  }

  verifyPayment(transactionId: string): Observable<Payment> {
    return this.apiService.get<Payment>(`/payments/verify/${transactionId}`);
  }

  cancelPayment(paymentId: string, reason: string): Observable<any> {
    return this.apiService.put(`/payments/${paymentId}/cancel`, { reason });
  }

  getPaymentMethods(): Observable<string[]> {
    return this.apiService.get<string[]>('/payments/methods');
  }

  getBankDetails(): Observable<{
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branchCode: string;
    branchAddress: string;
  }> {
    return this.apiService.get('/payments/bank-details');
  }
}