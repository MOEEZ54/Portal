import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = 'https://localhost:7213/api';

  constructor(private http: HttpClient) {}

  url(endpoint: string) {
    // Ensure there is no leading slash duplication
    return endpoint.startsWith('/') ? `${this.baseUrl}${endpoint}` : `${this.baseUrl}/${endpoint}`;
  }

  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (!params) return httpParams;
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return httpParams;
  }

  get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(this.url(endpoint), { params: httpParams });
  }

  post<T>(endpoint: string, body?: any, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.post<T>(this.url(endpoint), body || {}, { params: httpParams });
  }

  put<T>(endpoint: string, body?: any, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.put<T>(this.url(endpoint), body || {}, { params: httpParams });
  }

  delete<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.delete<T>(this.url(endpoint), { params: httpParams });
  }

  downloadFile(endpoint: string, params?: any): Observable<Blob> {
    const httpParams = this.buildParams(params);
    return this.http.get(this.url(endpoint), { params: httpParams, responseType: 'blob' });
  }

  uploadFile(endpoint: string, file: File, metadata?: any): Observable<any> {
    const form = new FormData();
    form.append('file', file, file.name);
    if (metadata) {
      Object.keys(metadata).forEach((k) => {
        const v = metadata[k];
        if (v !== undefined && v !== null) form.append(k, String(v));
      });
    }
    return this.http.post(this.url(endpoint), form);
  }
}

