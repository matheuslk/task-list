import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  BgColorsOutline,
  PushpinOutline,
} from '@ant-design/icons-angular/icons';
import { NZ_I18N, pt_BR } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppComponent } from './app/app.component';
import { MAIN_ROUTES } from './app/routes/main.routes';

const icons: IconDefinition[] = [BgColorsOutline, PushpinOutline];

registerLocaleData(pt);

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(MAIN_ROUTES),
    provideAnimations(),
    importProvidersFrom(NzIconModule.forRoot(icons)),
    { provide: NZ_I18N, useValue: pt_BR },
  ],
});
