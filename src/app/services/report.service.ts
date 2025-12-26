import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private apiService: ApiService) {}

  // Generate payment report
  generatePaymentReport(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/payments', params);
  }

  // Generate property report
  generatePropertyReport(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/properties', params);
  }

  // Generate financial statement
  generateFinancialStatement(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/financial-statement', params);
  }

  // Generate tax certificate
  generateTaxCertificate(year: number): Observable<Blob> {
    return this.apiService.downloadFile(`/reports/tax-certificate?year=${year}`);
  }

  // Generate installment schedule
  generateInstallmentSchedule(propertyId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/reports/installment-schedule/${propertyId}`);
  }

  // Generate audit trail
  generateAuditTrail(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/audit-trail', params);
  }

  // Generate performance report
  generatePerformanceReport(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/performance', params);
  }

  // Generate dashboard analytics
  getDashboardAnalytics(): Observable<any> {
    return this.apiService.get('/reports/dashboard-analytics');
  }

  // Generate custom report
  generateCustomReport(reportConfig: any): Observable<Blob> {
    return this.apiService.post('/reports/custom', reportConfig);
  }

  // Get report templates
  getReportTemplates(): Observable<any[]> {
    return this.apiService.get<any[]>('/reports/templates');
  }

  // Save report template
  saveReportTemplate(template: any): Observable<any> {
    return this.apiService.post('/reports/templates', template);
  }

  // Generate comparative report
  generateComparativeReport(params: any): Observable<Blob> {
    return this.apiService.downloadFile('/reports/comparative', params);
  }

  // Generate trend analysis
  generateTrendAnalysis(params: any): Observable<any> {
    return this.apiService.get('/reports/trend-analysis', params);
  }

  // Generate forecast report
  generateForecastReport(params: any): Observable<any> {
    return this.apiService.get('/reports/forecast', params);
  }

  // Export report data
  exportReportData(reportType: string, format: 'csv' | 'excel' | 'pdf', params?: any): Observable<Blob> {
    return this.apiService.downloadFile(`/reports/export/${reportType}/${format}`, params);
  }

  // Schedule report generation
  scheduleReport(reportConfig: any, schedule: any): Observable<any> {
    return this.apiService.post('/reports/schedule', {
      reportConfig,
      schedule
    });
  }

  // Get scheduled reports
  getScheduledReports(): Observable<any[]> {
    return this.apiService.get<any[]>('/reports/scheduled');
  }

  // Cancel scheduled report
  cancelScheduledReport(scheduleId: string): Observable<any> {
    return this.apiService.delete(`/reports/scheduled/${scheduleId}`);
  }

  // Get report history
  getReportHistory(params?: any): Observable<any[]> {
    return this.apiService.get<any[]>('/reports/history', params);
  }

  // Download generated report
  downloadGeneratedReport(reportId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/reports/download/${reportId}`);
  }

  // Share report
  shareReport(reportId: string, recipients: string[], message?: string): Observable<any> {
    return this.apiService.post(`/reports/${reportId}/share`, {
      recipients,
      message
    });
  }

  // Get report statistics
  getReportStats(): Observable<{
    totalReports: number;
    reportsByType: Record<string, number>;
    recentReports: any[];
  }> {
    return this.apiService.get('/reports/stats');
  }

  // Validate report data
  validateReportData(reportType: string, data: any): Observable<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    return this.apiService.post(`/reports/validate/${reportType}`, data);
  }

  // Merge multiple reports
  mergeReports(reportIds: string[]): Observable<Blob> {
    return this.apiService.post('/reports/merge', { reportIds });
  }
}
