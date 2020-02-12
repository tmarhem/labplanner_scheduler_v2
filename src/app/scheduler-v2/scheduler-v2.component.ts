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
  headers: Array<Array<string>>;

  constructor() { }

  ngOnInit() {
    this.generateHeaders(this.input[0]);
    this.generateSecondHeaders(this.headers[0]);
  }

/**
 * Fills headers with halfday headers then days headers then month headers
 * rows : a sample of data to get the necessary codes :
 * {user: string, _10022020am: string|TimeSlot, ...}
 */
  generateHeaders = (rows: any) => {
    this.headers = [];
    this.headers.push( Object.keys(rows) );
    this.headers[0].sort( (a,b) => {
      if(a==='user') return -1;
      if(b==='user') return 1;
      return 0;
    });
    // this.headers.push( this.headers[0].map( h => {
    //   if( h === 'user') return h;
    //   return h.slice(0,-2);
    // }));
    // this.headers.push( this.headers[0].map( h => {
    //   if( h === 'user') return h;
    //   return h.slice(3,5);
    // }));
  }

  generateSecondHeaders = ( firstHeaders: any) => {
    const duplicateHeaders = this.headers[0].map( h => {
      if( h === 'user') return h;
      return h.slice(0,-2);
    });
    console.log('duplicate',duplicateHeaders);
  }
}

export class TimeSlot{
  category: string;
  userId: string;
  value: string;
  projectId?: string;
}