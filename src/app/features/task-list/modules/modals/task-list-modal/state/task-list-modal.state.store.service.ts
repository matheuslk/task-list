import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IStateData } from 'src/app/core/data/interfaces/state-data.interface';

@Injectable()
export class TaskListModalStateStoreService {
  private close$ = new BehaviorSubject<IStateData>({
    isLoading: false,
  });

  // SETTERS

  setClose(close: IStateData): void {
    this.close$.next(close);
  }

  // SELECTORS

  selectClose$(): Observable<IStateData> {
    return this.close$.asObservable();
  }
}
