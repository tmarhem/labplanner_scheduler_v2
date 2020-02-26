import { TestBed } from '@angular/core/testing';

import { SchedulerNotificationService } from './scheduler-notification.service';

describe('SchedulerNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchedulerNotificationService = TestBed.get(SchedulerNotificationService);
    expect(service).toBeTruthy();
  });
});
