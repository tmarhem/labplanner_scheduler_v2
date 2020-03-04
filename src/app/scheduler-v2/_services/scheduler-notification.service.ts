import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchedulerNotificationService {
  constructor() {
  }

  private genericSource = new Subject<NotificationAction<any>>();
  public genericAction = this.genericSource.asObservable(); // leaving access only to the observable so you cannot use/spoof the subject at will

  public sendGenericAction = (slaNotification: NotificationAction<any>) => {
    this.genericSource.next(slaNotification);
  };
}

export class NotificationAction<T> {
  constructor(type: Actions, id?: number, data?: T) {
    this.type = type;
    this.id = id ? id : undefined;
    this.data = data ? data : undefined;
  }
  data?: T;
  id?: number;
  type: Actions;
}

export enum Actions {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  SELECT = 'SELECT',
  REFRESH = 'REFRESH',
  RESET = 'RESET',
  APPLY = 'APPLY'
}

