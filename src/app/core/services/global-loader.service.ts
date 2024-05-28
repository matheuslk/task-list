import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  createComponent,
  inject,
} from '@angular/core';
import { SpinOverlayComponent } from 'src/app/shared/components/spin-overlay/spin-overlay.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private appRef = inject(ApplicationRef);
  private loaderComponentRef: ComponentRef<SpinOverlayComponent> | null = null;

  create(): void {
    if (this.loaderComponentRef) {
      return;
    }
    this.loaderComponentRef = createComponent(SpinOverlayComponent, {
      environmentInjector: this.appRef.injector,
    });
    this.appRef.attachView(this.loaderComponentRef.hostView);
    document.body.append(
      (<EmbeddedViewRef<any>>this.loaderComponentRef.hostView).rootNodes[0],
    );
  }

  destroy(): void {
    if (!this.loaderComponentRef) {
      return;
    }
    this.loaderComponentRef.destroy();
    this.loaderComponentRef = null;
  }
}
