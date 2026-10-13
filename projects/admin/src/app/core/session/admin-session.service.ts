import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { problemCode } from '../api/api-problem';
import { ADMIN_PERMISSIONS } from './permissions';
import { AdminSessionData, ROLE_LABELS } from './session.model';

export type SessionStatus = 'checking' | 'signed-in' | 'signed-out' | 'unreachable';

export type SignInResult = { ok: true } | { ok: false; code: string };

const SESSION_URL = '/api/v1/admin/session';
const LOGIN_URL = '/api/v1/admin/auth/login';
const LOGOUT_URL = '/api/v1/admin/auth/logout';

@Injectable({ providedIn: 'root' })
export class AdminSession {
  private readonly http = inject(HttpClient);

  private readonly _status = signal<SessionStatus>('checking');
  private readonly _data = signal<AdminSessionData | null>(null);

  readonly status = this._status.asReadonly();
  readonly user = computed(() => this._data()?.user ?? null);
  readonly role = computed(() => this._data()?.role ?? null);
  readonly roleLabel = computed(() => {
    const role = this.role();
    return role ? ROLE_LABELS[role] : '';
  });
  readonly permissions = computed<readonly string[]>(() => this._data()?.permissions ?? []);
  readonly signedIn = computed(() => this._status() === 'signed-in');

  readonly hasAdminAccess = computed(() => this.permissions().some((p) => ADMIN_PERMISSIONS.includes(p)));

  can(permission: string): boolean {
    return this.permissions().includes(permission);
  }

  async restore(): Promise<void> {
    this._status.set('checking');
    try {
      this.accept(await firstValueFrom(this.http.get<AdminSessionData>(SESSION_URL)));
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        this.clear();
      } else {
        this._data.set(null);
        this._status.set('unreachable');
      }
    }
  }

  async signIn(email: string, password: string): Promise<SignInResult> {
    try {
      this.accept(await firstValueFrom(this.http.post<AdminSessionData>(LOGIN_URL, { email, password })));
      return { ok: true };
    } catch (error) {
      return { ok: false, code: problemCode(error) };
    }
  }

  async signOut(): Promise<void> {
    await firstValueFrom(this.http.post<void>(LOGOUT_URL, null)).catch(() => undefined);
    this.clear();
  }

  expire(): void {
    this.clear();
  }

  private accept(data: AdminSessionData): void {
    this._data.set(data);
    this._status.set('signed-in');
  }

  private clear(): void {
    this._data.set(null);
    this._status.set('signed-out');
  }
}
