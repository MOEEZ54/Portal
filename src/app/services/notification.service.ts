import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Notification } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadNotifications();
  }

  private loadNotifications(): void {
    this.apiService.get<Notification[]>('/notifications').pipe(
      tap(notifications => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    ).subscribe();
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    this.unreadCountSubject.next(unreadCount);
  }

  getNotifications(unreadOnly: boolean = false): Observable<Notification[]> {
    return this.apiService.get<Notification[]>(`/notifications?unread=${unreadOnly}`).pipe(
      tap(notifications => {
        if (!unreadOnly) {
          this.notificationsSubject.next(notifications);
        }
        this.updateUnreadCount(notifications);
      })
    );
  }

  markAsRead(notificationId: string): Observable<any> {
    return this.apiService.put(`/notifications/${notificationId}/read`, {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  markAllAsRead(): Observable<any> {
    return this.apiService.put('/notifications/read-all', {}).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.map(n => ({
          ...n,
          isRead: true
        }));
        this.notificationsSubject.next(notifications);
        this.unreadCountSubject.next(0);
      })
    );
  }

  deleteNotification(notificationId: string): Observable<any> {
    return this.apiService.delete(`/notifications/${notificationId}`).pipe(
      tap(() => {
        const notifications = this.notificationsSubject.value.filter(
          n => n.id !== notificationId
        );
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount(notifications);
      })
    );
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  hasUnreadNotifications(): Observable<boolean> {
    return this.unreadCount$.pipe(
      map(count => count > 0)
    );
  }
}