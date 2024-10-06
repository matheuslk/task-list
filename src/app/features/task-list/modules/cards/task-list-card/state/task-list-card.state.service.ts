import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Injectable()
export class TaskListCardStateService {
  private isFixed$ = new BehaviorSubject(false);
  private isHovered$ = new BehaviorSubject(false);

  // SETTERS

  setIsFixed(isFixed: boolean): void {
    this.isFixed$.next(isFixed);
  }

  setIsHovered(isHovered: boolean): void {
    this.isHovered$.next(isHovered);
  }

  // SELECTORS

  selectShowOptions$(): Observable<boolean> {
    return combineLatest([
      this.isFixed$.asObservable(),
      this.isHovered$.asObservable(),
    ]).pipe(map(([isFixed, isHovered]) => isFixed || isHovered));
  }
}
