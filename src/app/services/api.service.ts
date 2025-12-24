import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  readonly baseUrl = 'https://localhost:7213/api';

  url(endpoint: string) {
    return `${this.baseUrl}/${endpoint}`;
  }
}

