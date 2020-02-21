import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SchedulerNotificationService {
    constructor() {}

    private genericSource = new Subject<NotificationAction<any>>();
    public genericAction = this.genericSource.asObservable(); // leaving access only to the observable so you cannot use/spoof the subject at will

    public sendGenericAction = (slaNotification: NotificationAction<any>) => {
        this.genericSource.next(slaNotification);
    };
}

export class NotificationAction<T> {
    constructor(type: Action, id?: number, data?: T) {
        this.type = type;
        this.id = id ? id : null;
        this.data = data ? data : null;
    }
    data?: T;
    id?: number;
    type: Action;
}

export enum Actions {
    CREATE = 'CREATE',
    DELETE = 'DELETE',
    EDIT = 'EDIT',
    SELECT = 'SELECT',
    REFRESH = 'REFRESH',
}
