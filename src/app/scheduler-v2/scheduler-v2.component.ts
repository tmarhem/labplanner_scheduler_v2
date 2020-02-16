import { Component, OnInit } from '@angular/core';
import { agGridData } from '../testData/data'

@Component({
  selector: 'app-scheduler-v2',
  templateUrl: './scheduler-v2.component.html',
  styleUrls: ['./scheduler-v2.component.css']
})
export class SchedulerV2Component implements OnInit {

  input: Array<{user: string}> = agGridData.result;
  duplicatedInput: Array<any>;
  startDate: Date;
  headers: Array<Array<string>>;
  // secondHeaders: Array<any>;
  // thirdHeaders: Array<any>;


  constructor() { }

  ngOnInit() {
    this.duplicateInput(this.input);
    this.generateHalfDayHeaders(this.input[0]);
    this.generateDayHeaders(this.headers[0]);
    this.generateMonthHeaders(this.headers[0]);
    console.log(this.getDispayDate('_10022020am'))
  }

/**
 * Fills headers with halfday headers then days headers then month headers
 * rows : a sample of data to get the necessary codes :
 * {user: string, _10022020am: string|TimeSlot, ...}
 */
  generateHalfDayHeaders = (rows: any) => {
    this.headers = [];
    this.headers.push( Object.keys(rows) );
    this.headers[0].sort( (a,b) => {
      if(a==='user') return -1;
      if(b==='user') return 1;
      return 0;
    })
    // this.headers[0]= this.headers[0].filter( h => h !== 'user');
  }

  generateDayHeaders = ( firstHeaders: any) => {
    const duplicateHeaders = this.headers[0].map( h => {
      if( h === 'user') return h;
      return h.slice(0,-2);
    }).map( h => h === 'user' ? 'user2' : h);
     let secondHeaders = [];
    duplicateHeaders.forEach( h => {
      let index = secondHeaders.findIndex( h2 => h2.code === h)
      if( index < 0) {
        secondHeaders.push({code: h, colSpan:1})
      } else {
        secondHeaders[index].colSpan ++;
      }
    });
    this.headers.push(secondHeaders);
  }


  generateMonthHeaders = ( firstHeaders: any ) => {
    const duplicateHeaders = this.headers[0].map( h => {
      if( h === 'user') return h;
      return h.slice(3,5);
    }).map( h => (h === 'user') ? 'user3' : h);
    let thirdHeaders = [];
    duplicateHeaders.forEach( h => {
      let index = thirdHeaders.findIndex( h2 => h2.code === h)
      if( index < 0) {
        thirdHeaders.push({code: h, colSpan:1})
      } else {
        thirdHeaders[index].colSpan ++;
      }
    });
    this.headers.push(thirdHeaders);
  }

  duplicateInput = (input: Array<any>) => {
    this.duplicatedInput = [];
    input.forEach( row => {
      // console.log('dup',row);
      this.duplicatedInput.push( row )
      this.duplicatedInput.push( this.emptyRowExceptUser(row))
    })
  }

  emptyRowExceptUser = (row: any) => {
    const clonedRow = Object.assign({}, row);
    for(let prop in row) {
      switch(prop){
        case 'user': break;
        default: clonedRow[prop] = ''; break;
      }
    }
    return clonedRow;
  }

  getDispayDate = (code: string): string => {
    switch(code.length){
      case 11:
      
      return 'test';
      break;
    }
  }
}
export class TimeSlot{

  category: string;
  userId: string;
  value: string;
  projectId?: string;
}