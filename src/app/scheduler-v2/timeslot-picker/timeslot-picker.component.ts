import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeslot-picker',
  templateUrl: './timeslot-picker.component.html',
  styleUrls: ['./timeslot-picker.component.css']
})
export class TimeslotPickerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getDefaultValue = () => {
    return JSON.stringify({category: "LAB", value: "Legallais", userId: "5cf662a6efaf2c00125b9b33", projectId: "5dcc170af9c9650010446001"});
  }

  sendApplyNotif = () => {
    //TODO use notif service
  }

}