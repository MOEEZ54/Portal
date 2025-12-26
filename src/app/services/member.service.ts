import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { 
  Member, 
  DashboardStats, 
  Property, 
  Payment, 
  Notification, 
  ActivityLog,
  PaginatedResponse 
} from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  constructor(private apiService: ApiService) {}

  getMemberProfile(): Observable<Member> {
    return this.apiService.get<Member>('/members/profile');
  }

  updateMemberProfile(profileData: Partial<Member>): Observable<Member> {
    return this.apiService.put<Member>('/members/profile', profileData);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.apiService.get<DashboardStats>('/members/dashboard/stats');
  }

  getMemberProperties(): Observable<Property[]> {
    return this.apiService.get<Property[]>('/members/properties');
  }

  getPropertyDetails(propertyId: string): Observable<Property> {
    return this.apiService.get<Property>(`/members/properties/${propertyId}`);
  }

  getRecentPayments(limit: number = 10): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(`/members/payments/recent?limit=${limit}`);
  }

  getUpcomingPayments(): Observable<Payment[]> {
    return this.apiService.get<Payment[]>('/members/payments/upcoming');
  }

  getOverduePayments(): Observable<Payment[]> {
    return this.apiService.get<Payment[]>('/members/payments/overdue');
  }

  getPaymentHistory(params?: any): Observable<PaginatedResponse<Payment>> {
    return this.apiService.get<PaginatedResponse<Payment>>('/members/payments/history', params);
  }

  getNotifications(unreadOnly: boolean = false): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`/members/notifications?unread=${unreadOnly}`);
  }

  markNotificationAsRead(notificationId: string): Observable<any> {
    return this.apiService.put(`/members/notifications/${notificationId}/read`, {});
  }

  downloadStatement(startDate: Date, endDate: Date, propertyId?: string): Observable<Blob> {
    const params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };
    
    if (propertyId) {
      params.propertyId = propertyId;
    }

    return this.apiService.downloadFile('/members/statements/download', params);
  }

  exportToExcel(propertyId?: string): Observable<Blob> {
    const params: any = {};
    if (propertyId && propertyId !== 'all') {
      params.propertyId = propertyId;
    }

    return this.apiService.downloadFile('/members/export/excel', params);
  }
}