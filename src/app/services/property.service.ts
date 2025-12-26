import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Property, 
  PropertyDocument,
  PaymentSchedule 
} from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  constructor(private apiService: ApiService) {}

  // ✅ REQUIRED BY userdashboard.component.ts
  getMemberProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/properties');
  }

  // ✅ REQUIRED BY userdashboard.component.ts (rename from getPropertyDetails)
  getPropertyById(propertyId: string): Observable<Property> {
    return this.apiService.get<Property>(`/properties/${propertyId}`);
  }

  // Alias method for backward compatibility
  getPropertyDetails(propertyId: string): Observable<Property> {
    return this.getPropertyById(propertyId);
  }

  getPropertyDocuments(propertyId: string): Observable<PropertyDocument[]> {
    return this.apiService.get<PropertyDocument[]>(`/properties/${propertyId}/documents`);
  }

  uploadPropertyDocument(propertyId: string, documentData: any, file: File): Observable<any> {
    return this.apiService.uploadFile(`/properties/${propertyId}/documents`, file, documentData);
  }

  downloadPropertyDocument(documentId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/properties/documents/${documentId}`);
  }

  deletePropertyDocument(documentId: string): Observable<any> {
    return this.apiService.delete(`/properties/documents/${documentId}`);
  }

  getPropertyPaymentSchedule(propertyId: string): Observable<PaymentSchedule[]> {
    return this.apiService.get<PaymentSchedule[]>(`/properties/${propertyId}/payment-schedule`);
  }

  getPropertyFinancialSummary(propertyId: string): Observable<{
    totalPrice: number;
    downPayment: number;
    paidAmount: number;
    dueAmount: number;
    remainingInstallments: number;
    nextPaymentDate: Date;
    nextPaymentAmount: number;
    completionPercentage: number;
  }> {
    return this.apiService.get(`/properties/${propertyId}/financial-summary`);
  }

  getPropertyTaxDetails(propertyId: string): Observable<{
    annualTax: number;
    paidTax: number;
    dueTax: number;
    taxHistory: Array<{ year: number; amount: number; status: string }>;
  }> {
    return this.apiService.get(`/properties/${propertyId}/tax`);
  }
}