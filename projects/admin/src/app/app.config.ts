import { ApplicationConfig, LOCALE_ID, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { TitleStrategy, provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { csrfInterceptor } from './core/api/csrf.interceptor';
import { AdminSession } from './core/session/admin-session.service';
import { sessionExpiredInterceptor } from './core/session/session-expired.interceptor';
import { AdminTitleStrategy } from './core/store/admin-title.strategy';
import { StoreProfileService } from './core/store/store-profile.service';

registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([csrfInterceptor, sessionExpiredInterceptor])),
    provideAppInitializer(() => {
      void inject(StoreProfileService).load();
      return inject(AdminSession).restore();
    }),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: AdminTitleStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
};
