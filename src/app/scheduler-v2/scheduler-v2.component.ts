import { Component, OnInit } from '@angular/core';
import { agGridData } from '../testData/data'

@Component({
  selector: 'app-scheduler-v2',
  templateUrl: './scheduler-v2.component.html',
  styleUrls: ['./scheduler-v2.component.css']
})
export class SchedulerV2Component implements OnInit {

  input: Array<{user: string}> = agGridData.result;
  startDate: Date;
  headers: Array<string>;

  constructor() { }

  ngOnInit() {
    this.headers = Object.keys(this.input[0]);
    // this.headers = this.headers.filter( h => h !== 'user');
  }

}

export class TimeSlot{
  category: string;
  userId: string;
  value: string;
  projectId?: string;
}