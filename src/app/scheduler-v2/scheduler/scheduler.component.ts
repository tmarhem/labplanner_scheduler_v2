import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.css"],
})
export class SchedulerComponent implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;


  @Input() headers: Array<Array<any>>;
  @Input() rows: Array<any>;

  headersCodes: Array<Array<string>>;

  isSelecting = true;
  isChecking = true;
  selectedHeaders : Set<string>;
  selectionStart: {
    index: number,
    code: string,
  }

  dataSource: any;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: any, filter) => {
      // TODO regex to allow typing the end of the name
      // TODO avoid filtering selection cell Row OR Filtering only in selection mode
    const dataStr =JSON.stringify(data).toLowerCase();
    return dataStr.indexOf(`"value":"${filter}`) != -1 && dataStr.indexOf(`"user":"${filter}`) === -1; 
  }

    this.selectedHeaders = new Set<string>();
    this.headersCodes = this.headers.map(headerRow =>
      headerRow.map(header => header.code)
    );
  }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClickAction = (eventType: string, code: string, colIndex: number, ctrlKey: boolean) => {
    if (colIndex === 0) return;
    switch(eventType) {
      case 'mousedown':
        this.isSelecting = true;
        this.selectHeader(code, colIndex);
        this.selectionStart = {
          code: code,
          index: colIndex
        }
      case 'mouseover':
      case 'mouseup':
        this.isSelecting = false;
    }
  }

  selectHeader = (code: string, colIndex: number, isFirst?: boolean) => {
    if(isFirst){
      this.isChecking = !this.headers[0][colIndex].isSelected;
    }

    switch(code.length){
      case 11:
        this.headers[0][colIndex].isSelected = this.isChecking;
        break;
      case 9:
      case 6:
      default:
      console.log('WRONG LENGTH')
    }
  }

  handleError = (e: any) => {
    console.log("handleError", e);
  };

  getTimeSlotDisplayValue = (row, code) => {
    if (!row[code]) {
      return null;
    }
    if (row[code].value) return row[code].value;
    if (typeof row[code] === "string") return row[code];
    return "NA";
  };

  //TODO to not span same text on different types
  isSameTimeslot = (t1, t2): boolean => {
    return false;
  };

  /**
   * Returns the spanning for a defined cell, if 0 the cell should be hidden
   * row: the row object with all codes / values
   * index: the column colIndex
   * code: current code at this index
   * isFirst: boolean, true if first col
   * isLast: boolean, true if last col
   */
  getRowSpan = (row, colIndex, codex, isFirst, isLast) => {
    const code = this.headersCodes[0][colIndex];
    try {
      const isSelectionCell = row[code] === "";

      if (isFirst || isSelectionCell) {
        return 1;
      }

      let span = 0;
      let currentCellValue = this.getTimeSlotDisplayValue(
        row,
        this.headersCodes[0][colIndex]
      );
      let previousCellValue = this.getTimeSlotDisplayValue(
        row,
        this.headersCodes[0][colIndex - 1]
      );
      let isPreviousCellSameValue = currentCellValue === previousCellValue;

      if (isPreviousCellSameValue) {
        return 0;
      }

      let nextCellValue;
      let isNextCellSameValue;

      do {
        currentCellValue = this.getTimeSlotDisplayValue(
          row,
          this.headersCodes[0][colIndex + span]
        );
        nextCellValue = this.getTimeSlotDisplayValue(
          row,
          this.headersCodes[0][colIndex + 1 + span]
        );
        isNextCellSameValue = currentCellValue === nextCellValue;
        span++;
      } while (isNextCellSameValue);

      return span;
    } catch (e) {
      this.handleError(e);
    }
  };

    getRowClasses = (row, colIndex, codex, isFirst, isLast) => {
      const code = this.headersCodes[0][colIndex];
      const classes = [];
      const rowSpan = this.getRowSpan(row, colIndex, code, isFirst, isLast);
      const category = row[code].category ? row[code].category : null;

      if( category)
      classes.push(category);
      if ( rowSpan === 0) {
        classes.push('hidden');
      }
      return classes;
    }

 
}



