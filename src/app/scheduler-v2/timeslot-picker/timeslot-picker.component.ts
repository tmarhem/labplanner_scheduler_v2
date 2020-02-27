import { Component, OnInit } from '@angular/core';
import { SchedulerNotificationService, NotificationAction, Actions } from '../_services/scheduler-notification.service'

@Component({
  selector: 'app-timeslot-picker',
  templateUrl: './timeslot-picker.component.html',
  styleUrls: ['./timeslot-picker.component.css']
})
export class TimeslotPickerComponent implements OnInit {

  constructor(
    public notifService: SchedulerNotificationService
  ) { }

  ngOnInit() {
  }

  getDefaultValue = () => {
    return JSON.stringify({ category: "LAB", value: "Legallais", userId: "5cf662a6efaf2c00125b9b33", projectId: "5dcc170af9c9650010446001" });
  }

  sendApplyNotif = () => {
    console.log('sending')
    this.notifService.sendGenericAction(new NotificationAction<string>(Actions.REFRESH, 0, this.getDefaultValue()))
  }

}