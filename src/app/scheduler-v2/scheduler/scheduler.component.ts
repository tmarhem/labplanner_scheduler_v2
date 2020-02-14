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

  spannedRows: Array<any>;
  codesList: Array<string>;

  constructor() { }

  ngOnInit() {
    console.log( this.headers[0])
    this.secondHeadersList = this.headers[1].map( h => h.code);
    this.thirdHeadersList = this.headers[2].map( h => h.code);
  }

  getTimeSlotDisplayValue = (row, code) => {
    if( !row[code]){ return null};
    if (row[code].value) return row[code].value;
    if (typeof row[code] === 'string') return row[code];
    return 'NA';
  }

  //TODO to not span same text on different types
  isSameTimeslot = (t1, t2): boolean => {
    return false;
  }

  /**
   * Returns the spanning for a defined cell, if 0 the cell should be hidden
   * row: the row object with all codes /values
   * index: the column number
   * code: the current code at this index
   * isFirst: boolean, true if first col
   * isLast: boolean, true if last col
   */
  getRowSpan = (row, colIndex, code, isFirst, isLast) => {
    const isSelectionCell = row[code] === "";
    if( isFirst || isSelectionCell ) {return 1;};

    let span = 0;
    let currentCellValue = this.getTimeSlotDisplayValue(row, this.headers[0][colIndex]);
    let previousCellValue = this.getTimeSlotDisplayValue(row, this.headers[0][colIndex -1]);
    let isPreviousCellSameValue = currentCellValue === previousCellValue ;
    if( isPreviousCellSameValue ) {return 0;};

    let nextCellValue;
    let isNextCellSameValue;

    do {
      currentCellValue = this.getTimeSlotDisplayValue(row, this.headers[0][colIndex + span]);
      nextCellValue = this.getTimeSlotDisplayValue(row, this.headers[0][colIndex + 1 + span]);
      isNextCellSameValue = currentCellValue === nextCellValue;
      span ++;
    } while ( isNextCellSameValue );

    return span;
  }


  generateSpannedRow = () => {

    this.spannedRows = [];
    let isOdd: boolean;
    let rowCodesList: Array<string>;

    let codeIndex;
    let currentCodeDisplayValue;
    let currentCode;
    let isReading;

    this.rows.forEach( (row, rowIndex) =>{
      this.spannedRows.push({});//

      isOdd = !(rowIndex%2 === 0);
      if( isOdd ) {return};
      rowCodesList = Object.keys(row);

      codeIndex = 0;
      isReading = false;
      while( codeIndex < rowCodesList.length) {
        if(!isReading){
          currentCode = rowCodesList[codeIndex];
          currentCodeDisplayValue = this.getTimeSlotDisplayValue(row, currentCode);
          isReading = true;

              console.log('spanned1', this.spannedRows)

          this.spannedRows[rowIndex][currentCode] = row[currentCode];
          this.spannedRows[rowIndex][currentCode].colSpan = 1;
          console.log(currentCode, currentCodeDisplayValue);
        }
        codeIndex ++;
      }

    });
    console.log('spanned', this.spannedRows)
  }

}