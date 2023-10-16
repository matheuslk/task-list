import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { MAIN_ROUTES } from './app/routes/main.routes';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';

registerLocaleData(pt);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(MAIN_ROUTES),
    { provide: NZ_I18N, useValue: pt_BR },
  ],
});
