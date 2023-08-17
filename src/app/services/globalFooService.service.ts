import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalFooService {
  name = '';

  private fooSubject = new Subject<any>();
  private fooSubject1 = new Subject<any>();

  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }
  publishSomeData1(data: any) {
    this.fooSubject1.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  getObservable1(): Subject<any> {
    return this.fooSubject1;
  }
}
