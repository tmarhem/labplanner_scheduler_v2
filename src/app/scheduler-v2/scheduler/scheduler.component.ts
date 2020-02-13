import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  @Input() headers: Array<Array<any>>;
  @Input() rows: Array<any>;

  secondHeadersList: Array<string>;
  thirdHeadersList: Array<string>;

  spannedRows: Array<Array<any>>;

  constructor() { }

  ngOnInit() {
    this.secondHeadersList = this.headers[1].map( h => h.code);
    this.thirdHeadersList = this.headers[2].map( h => h.code);
    this.generateSpannedRow();
  }

  getValue = (element, header) => {
    if (element[header].value) return element[header].value;
    if (typeof element[header] === 'string') return element[header];
    return 'NA';
  }

  getRowSpan = (header)=>{
    console.log('h',header);
    return header === 'user3' ? 3 : 1
  }
  
  test = (element, i, header) => {
    // if (element[header].value === 'Legallais') { return 2}
    return 1;
  }

  generateSpannedRow = () => {

    this.spannedRows = [];
    let isOdd: boolean;
    let rowCodesList: Array<string>;

    let codeIndex;
    let currentCodeValue;
    let currentCode;
    let isReading;

    this.rows.forEach( (row, rowIndex) =>{
      isOdd = !(rowIndex%2 === 0);
      if( isOdd ) {return};
      rowCodesList = Object.keys(row);

      codeIndex = 0;
      isReading = false;
      while( codeIndex < rowCodesList.length) {
        if(!isReading){
          currentCode = rowCodesList[codeIndex];
          currentCodeValue = this.getValue(row, currentCode);
          isReading = true;
          console.log(currentCode, currentCodeValue);
        }
        codeIndex ++;
      }



      

    });
    console.log('spanned', this.spannedRows)
  }

}