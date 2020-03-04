import { Component, OnInit } from '@angular/core';
import { SchedulerNotificationService } from '../_services/scheduler-notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    public notifService: SchedulerNotificationService
  ) { }

  ngOnInit() {
    // this.notifService.sendGenericAction();
    this.notifService.genericAction.subscribe(() => { })
  }

}