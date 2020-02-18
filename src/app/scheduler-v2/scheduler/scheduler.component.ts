import { Component, OnInit, Input } from '@angular/core';
import { format, isValid } from 'date-fns';
import { fr, enGB } from 'date-fns/locale';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  @Input() headers: Array<Array<any>>;
  @Input() rows: Array<any>;

  firstHeadersList: Array<string>;
  secondHeadersList: Array<string>;
  thirdHeadersList: Array<string>;

  spannedRows: Array<any>;
  codesList: Array<string>;

  lang = fr;

  constructor() { }

  ngOnInit() {
    this.firstHeadersList = this.headers[0].map( h => h.code);
    this.secondHeadersList = this.headers[1].map( h => h.code);
    this.thirdHeadersList = this.headers[2].map( h => h.code);
    
    this.dateFormat( new Date(), 'P');
  }

  handleError = (e: any) => {
    console.log( 'handleError', e);
  }

  dateFormat = (date: Date, pattern?: string) => {
    try {
      if (!isValid(date)) { return 'User' };
      return format(date, pattern ? pattern : 'P', {locale: this.lang})
      .replace(/^\w/, c => c.toUpperCase());
    } catch (e) {
      this.handleError(e);
    }
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
    try{

    const isSelectionCell = row[code] === "";
    if( isFirst || isSelectionCell ) {return 1;};

    let span = 0;
    let currentCellValue = this.getTimeSlotDisplayValue(row, this.firstHeadersList[colIndex]);
    let previousCellValue = this.getTimeSlotDisplayValue(row, this.firstHeadersList[colIndex -1]);
    let isPreviousCellSameValue = currentCellValue === previousCellValue ;
    if( isPreviousCellSameValue ) {return 0;};

    let nextCellValue;
    let isNextCellSameValue;

    do {
      currentCellValue = this.getTimeSlotDisplayValue(row, this.firstHeadersList[colIndex + span]);
      nextCellValue = this.getTimeSlotDisplayValue(row, this.firstHeadersList[colIndex + 1 + span]);
      isNextCellSameValue = currentCellValue === nextCellValue;
      span ++;
    } while ( isNextCellSameValue );

    return span;
    } catch (e) {
      this.handleError(e);
    }
  }

}