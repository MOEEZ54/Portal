import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PropertyDocument, DocumentType } from '../models/member.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private apiService: ApiService) {}

  // Upload document
  uploadDocument(file: File, documentData: any): Observable<any> {
    return this.apiService.uploadFile('/documents/upload', file, documentData);
  }

  // Download document
  downloadDocument(documentId: string): Observable<Blob> {
    return this.apiService.downloadFile(`/documents/${documentId}`);
  }

  // Get all documents
  getDocuments(filters?: any): Observable<PropertyDocument[]> {
    return this.apiService.get<PropertyDocument[]>('/documents', filters);
  }

  // Get document by ID
  getDocumentById(documentId: string): Observable<PropertyDocument> {
    return this.apiService.get<PropertyDocument>(`/documents/${documentId}`);
  }

  // Update document metadata
  updateDocument(documentId: string, updates: any): Observable<any> {
    return this.apiService.put(`/documents/${documentId}`, updates);
  }

  // Delete document
  deleteDocument(documentId: string): Observable<any> {
    return this.apiService.delete(`/documents/${documentId}`);
  }

  // Get document types
  getDocumentTypes(): Observable<DocumentType[]> {
    return this.apiService.get<DocumentType[]>('/documents/types');
  }

  // Share document via email
  shareDocument(documentId: string, email: string, message?: string): Observable<any> {
    return this.apiService.post(`/documents/${documentId}/share`, {
      email,
      message
    });
  }

  // Generate document preview URL
  getDocumentPreviewUrl(documentId: string): string {
    return `${this.apiService['baseUrl']}/documents/${documentId}/preview`;
  }

  // Verify document
  verifyDocument(documentId: string): Observable<any> {
    return this.apiService.post(`/documents/${documentId}/verify`, {});
  }

  // Get document verification status
  getVerificationStatus(documentId: string): Observable<{
    verified: boolean;
    verifiedBy?: string;
    verifiedDate?: Date;
    remarks?: string;
  }> {
    return this.apiService.get(`/documents/${documentId}/verification-status`);
  }

  // Bulk upload documents
  bulkUploadDocuments(files: File[], propertyId: string): Observable<any[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append('propertyId', propertyId);

    return this.apiService.post('/documents/bulk-upload', formData);
  }

  // Get document categories
  getDocumentCategories(): Observable<string[]> {
    return this.apiService.get<string[]>('/documents/categories');
  }

  // Create document folder
  createFolder(folderData: any): Observable<any> {
    return this.apiService.post('/documents/folders', folderData);
  }

  // Get folders
  getFolders(parentId?: string): Observable<any[]> {
    const params = parentId ? { parentId } : {};
    return this.apiService.get('/documents/folders', params);
  }

  // Move document to folder
  moveToFolder(documentId: string, folderId: string): Observable<any> {
    return this.apiService.put(`/documents/${documentId}/move`, { folderId });
  }

  // Get document statistics
  getDocumentStats(): Observable<{
    totalDocuments: number;
    totalSize: number;
    byType: Record<string, number>;
    byProperty: Array<{ property: string; count: number }>;
  }> {
    return this.apiService.get('/documents/stats');
  }

  // Request document signature
  requestSignature(documentId: string, signers: any[]): Observable<any> {
    return this.apiService.post(`/documents/${documentId}/request-signature`, { signers });
  }

  // Get document signature status
  getSignatureStatus(documentId: string): Observable<{
    signed: boolean;
    signers: Array<{ name: string; signed: boolean; signedAt?: Date }>;
  }> {
    return this.apiService.get(`/documents/${documentId}/signature-status`);
  }

  // Download multiple documents as zip
  downloadDocumentsAsZip(documentIds: string[]): Observable<Blob> {
    return this.apiService.post('/documents/download-zip', { documentIds });
  }

  // Search documents
  searchDocuments(query: string, filters?: any): Observable<PropertyDocument[]> {
    const params = { q: query, ...filters };
    return this.apiService.get<PropertyDocument[]>('/documents/search', params);
  }

  // Get recent documents
  getRecentDocuments(limit: number = 10): Observable<PropertyDocument[]> {
    return this.apiService.get<PropertyDocument[]>(`/documents/recent?limit=${limit}`);
  }

  // Set document expiration
  setDocumentExpiration(documentId: string, expirationDate: Date): Observable<any> {
    return this.apiService.put(`/documents/${documentId}/expiration`, { expirationDate });
  }

  // Get expiring documents
  getExpiringDocuments(days: number = 30): Observable<PropertyDocument[]> {
    return this.apiService.get<PropertyDocument[]>(`/documents/expiring?days=${days}`);
  }
}
