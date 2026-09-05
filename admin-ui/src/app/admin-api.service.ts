import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface BankSummary {
  id?: number;
  uuid: string;
  name: string;
  bic?: string;
  bankCode?: string;
  isActive?: boolean;
}

export interface BankData {
  bank: BankSummary;
  profiles?: BankProfile[];
}

export interface BankProfile {
  id?: number;
  uuid?: string;
  adapterId?: string;
  url?: string;
  idpUrl?: string;
  protocolType?: string;
  protocolConfiguration?: string;
  externalId?: string;
  externalInterfaces?: string;
  bankCode?: string;
  bic?: string;
  name?: string;
  isSandbox?: boolean;
  isActive?: boolean;
  preferredApproach?: string;
  scaApproaches?: string[];
  supportedConsentType?: string;
  tryToUsePreferredApproach?: boolean;
  actions?: Record<string, unknown>;
}

export interface PageBankData {
  content: BankSummary[];
  totalElements?: number;
  totalPages?: number;
  number?: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.gatewayApi;
  private credentials = '';

  setCredentials(username: string, password: string): void {
    this.credentials = btoa(`${username}:${password}`);
  }

  clearCredentials(): void {
    this.credentials = '';
  }

  hasCredentials(): boolean {
    return this.credentials.length > 0;
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      ...(this.credentials ? { Authorization: `Basic ${this.credentials}` } : {})
    });
  }

  listBanks(page = 0, size = 50): Observable<PageBankData> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageBankData>(`${this.base}/admin/v1/banks`, { headers: this.headers(), params });
  }

  getBank(uuid: string): Observable<BankData> {
    return this.http.get<BankData>(`${this.base}/admin/v1/banks/${encodeURIComponent(uuid)}`, { headers: this.headers() });
  }

  saveBank(uuid: string, bank: BankData, update = false): Observable<BankData> {
    const method = update ? 'patch' : 'put';
    return this.http.request<BankData>(method, `${this.base}/admin/v1/banks/${encodeURIComponent(uuid)}`, {
      headers: this.headers().set('Content-Type', 'application/json'),
      body: bank
    });
  }

  deleteBank(uuid: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/v1/banks/${encodeURIComponent(uuid)}`, { headers: this.headers() });
  }
}
