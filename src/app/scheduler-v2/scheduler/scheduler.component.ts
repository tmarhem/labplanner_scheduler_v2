import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.css"]
})
export class SchedulerComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input() headers: Array<Array<any>>;
  @Input() rows: Array<any>;

  headersCodes: Array<Array<string>>;

  isSelecting = false;
  isChecking = true;
  selectedHeaders: Set<string>;
  selectionStart: {
    rowIndex: number,
    colIndex: number,
    code: string,
    isChecking: boolean,
  };
  headerRowIndex: number;

  dataSource: any;

  constructor() {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource<any>(this.rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: any, filter) => {
      // TODO regex to allow typing the end of the name
      // TODO avoid filtering selection cell Row OR Filtering only in selection mode
      const dataStr = JSON.stringify(data).toLowerCase();
      return (
        dataStr.indexOf(`"value":"${filter}`) != -1 &&
        dataStr.indexOf(`"user":"${filter}`) === -1
      );
    };

    this.selectedHeaders = new Set<string>();
    this.headersCodes = this.headers.map(headerRow =>
      headerRow.map(header => header.code)
    );
  }

  /**
   * Filters datsource according to filter input
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * @param cellType: HEADER or CELL, source of the eventType
   * @param eventType: mouseenter, mouseleave, mousedown, mouseup : click event type
   * @param code: cell code
   * @param colIndex: cell colum index
   * @param ctrlKey: boolean is ctrl key
   */
  onClickAction = (
    cellType: string,
    eventType: string,
    code: string,
    colIndex: number,
    ctrlKey: boolean
  ) => {
    if (colIndex === 0) return;

    const headerRowIndex = this.getHeaderRowIndex(code);

    switch (eventType) {
      case "mousedown":
        if (!ctrlKey) {
          this.clearSelection();
        }
        this.isSelecting = true;
        this.selectionStart = {
          code: code,
          rowIndex: headerRowIndex,
          colIndex: colIndex,
          isChecking: !this.headers[headerRowIndex][colIndex].isSelected,
        };

        this.selectHeader(code, colIndex, headerRowIndex);

        break;
      case "mouseenter":
        if (this.isSelecting) {
          this.selectHeader(code, colIndex, headerRowIndex);
          this.fillHeadersSelection(colIndex, headerRowIndex);
        }
        break;
      case "mouseup":
          this.isSelecting = false;
          break;
      case "mouseleave":
          this.isSelecting = false;
          break;
        
    }
  };


// Todo more generic : Arrat.find(code) in all headers
  getHeaderRowIndex = (code: string) => {
    if (code) {
      switch (code.length) {
        case 11:
          return 0;
          break;
        case 9:
          return 1;
          break;
        case 6:
          return 2;
          break;
        default:
          return -1;
          break;
      }
    }
  }

  selectHeader = (
    code: string,
    colIndex: number,
    headerRowIndex: number,
  ) => {
    const isSameRow = this.selectionStart.rowIndex === headerRowIndex;
    if (!isSameRow) {
      return;
    }
    this.headers[headerRowIndex][colIndex].isSelected = this.selectionStart.isChecking;
  };

  fillHeadersSelection = (colIndex: number, headerRowIndex: number) => {
    const isSameCell = colIndex === this.selectionStart.colIndex;
    if (isSameCell) {
      return;
    }
    const isLeftToRightSelection = this.selectionStart.colIndex < colIndex;
    const startIndex = isLeftToRightSelection
      ? this.selectionStart.colIndex
      : colIndex;
    const endIndex = isLeftToRightSelection
      ? colIndex
      : this.selectionStart.colIndex;

    for (let i = startIndex; i < endIndex; i++) {
      this.headers[headerRowIndex][i].isSelected = this.selectionStart.isChecking;
    }
  };

  clearSelection = () => {
    this.headers.forEach(headerRow =>
      headerRow.map(h => {
        h.isSelected = false;
        return h;
      })
    );
  };

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

    if (category) classes.push(category);
    if (rowSpan === 0) {
      classes.push("hidden");
    }
    return classes;
  };
}
