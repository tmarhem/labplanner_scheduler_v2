import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.css"],
})
export class SchedulerComponent implements OnInit {
  @Input() headers: Array<Array<any>>;
  @Input() rows: Array<any>;

  headersCodes: Array<Array<string>>;
  reversedHeadersCodes: Array<Array<string>>;

  firstHeadersList: Array<string>;
  secondHeadersList: Array<string>;
  thirdHeadersList: Array<string>;

  spannedRows: Array<any>;
  codesList: Array<string>;


  constructor() {}

  ngOnInit() {
    this.firstHeadersList = this.headers[0].map(h => h.code);
    this.secondHeadersList = this.headers[1].map(h => h.code);
    this.thirdHeadersList = this.headers[2].map(h => h.code);
    this.headersCodes = this.headers.map(headerRow =>
      headerRow.map(header => header.code)
    );
    this.reversedHeadersCodes = this.headersCodes.slice().reverse();
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



