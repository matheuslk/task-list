import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPreventClickBubbling]',
  standalone: true,
})
export class PreventClickBubblingDirective {
  @HostListener('click', ['$event'])
  public clickListener(event: Event): void {
    event.stopPropagation();
  }
}
