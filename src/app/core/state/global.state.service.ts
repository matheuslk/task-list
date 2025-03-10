import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalStateService {
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // SETTERS

  setIsLoading(isLoading: boolean): void {
    this.isLoading$.next(isLoading);
  }

  // SELECTORS

  selectIsLoading$(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
