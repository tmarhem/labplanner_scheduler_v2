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
  headers: Array<Array<string>> = [];

  constructor() { }

  ngOnInit() {
    this.headers.push( Object.keys(this.input[0]) );
    this.headers[0].sort( (a,b) => {
      if(a==='user') return -1;
      if(b==='user') return 1;
      return 0;
    });
  }

}

export class TimeSlot{
  category: string;
  userId: string;
  value: string;
  projectId?: string;
}