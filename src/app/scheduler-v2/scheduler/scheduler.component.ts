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

    this.spannedRows = Object.assign({}, this.rows);
    // row[0] = index, row[1]= value
    let isOdd: boolean;
    let rowIndex: number;
    let rowValues : any;
    let rowCodesList: Array<string>;

    let nextCode: string
    let nextValue: string;
    
    for ( const row of this.spannedRows.entries()){
      rowIndex = row[0];
      isOdd = !(rowIndex%2 === 0);
      if( isOdd ) break;
      rowValues = row[1];
      rowCodesList = Object.keys(rowValues);

      for( let code of rowCodesList.entries() ){
        code[1]['colSpan'] = 1;
        nextValue = this.getValue(rowValues, rowCodesList)
        while( rowValues[code[0] + code[1]['colSpan']]) {

        }

      }
    }
  }

}