import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { SchedulerNotificationService } from "../_services/scheduler-notification.service";
@Component({
  selector: "app-scheduler",
  templateUrl: "./scheduler.component.html",
  styleUrls: ["./scheduler.component.css"],
  providers: [SchedulerNotificationService]
})
export class SchedulerComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  @Input() headers!: Array<Array<any>>;
  @Input() rows!: Array<any>;

  headersCodes!: Array<any>;

  isSelecting = false;
  isChecking = true;
  selectedHeaders!: Set<string>;
  selectionStartCell!: {
    rowIndex: number;
    colIndex: number;
    code: string;
    isChecking: boolean;
  };

  dataSource: any;

  HIDE = false; // WIP for isComplexModeEnabled

  constructor(
    public notifService: SchedulerNotificationService
  ) {

  }

  ngOnInit() {
    this.notifService.genericAction.subscribe(r => console.log("notif", r));
    this.dataSource = new MatTableDataSource<any>(this.rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: any, filter: any) => {
      // TODO regex to allow typing the end of the name
      // TODO avoid filtering selection cell Row OR Filtering only in selection mode
      const dataStr = JSON.stringify(data).toLowerCase();
      return (
        dataStr.indexOf(`"value":"${filter}`) != -1 &&
        dataStr.indexOf(`"user":"${filter}`) === -1
      );
    };

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
   * @param cellType: HEADER or DATA, source of the eventType
   * @param eventType: mouseenter, mouseleave, mousedown, mouseup : click event type
   * @param code: cell code
   * @param colIndex: cell colum index
   * @param ctrlKey: boolean is ctrl key down
   */
  onClickAction = (
    cellType: string,
    eventType: string,
    code: string,
    colIndex: number,
    ctrlKey: boolean,
    rowIndex: number
  ) => {
    try {
      // TODO replace by isSelectionCell
      if (colIndex === 0) { // User header
        return;
      }

      switch (eventType) {
        case "mousedown":
          const activeCell = this.getActiveCell(cellType, colIndex, rowIndex);
          if (!this.isSelectionCell(activeCell)) {
            return;
          }

          this.selectionStartCell = {
            code: code,
            rowIndex: rowIndex,
            colIndex: colIndex,
            isChecking: !activeCell.isSelected
          };

          this.isSelecting = true;

          if (!ctrlKey) {
            this.clearCellsSelection();
          }
          this.selectCell(cellType, colIndex, rowIndex);
          break;
        case "mouseenter":
          if (this.isSelecting) {
            this.fillCellSelection(cellType, code, colIndex, rowIndex);
          }
          break;
        case "mouseup":
          this.isSelecting = false;
          break;
        case "mouseleave":
          this.isSelecting = false;
          break;
      }
    } catch (e) {
      this.handleError(e);
    }
  };

  selectCell = (
    cellType: string,
    colIndex: number,
    rowIndex: number
  ) => {
    const isSameRow = this.selectionStartCell.rowIndex === rowIndex;
    if (!isSameRow) {
      return;
    }
    const activeCell = this.getActiveCell(cellType, colIndex, rowIndex);
    activeCell.isSelected = this.selectionStartCell.isChecking;
  };

  getActiveCell = (cellType: string, colIndex: number, rowIndex: number) => {
    if (isNaN(colIndex) || isNaN(rowIndex)) {
      return null;
    }
    let activeCell;
    if (cellType === "HEADER") {
      activeCell = this.headers[rowIndex][colIndex];
    } else if (cellType === "DATA") {
      activeCell = this.dataSource.data[rowIndex][this.headersCodes[0][colIndex]];
    } else {
      throw new Error(`getActiveCell: Wrong cellType provided: ${cellType}`)
    }
    return activeCell;
  }


  fillCellSelection = (
    cellType: string,
    code: string,
    colIndex: number,
    rowIndex: number
  ) => {
    const isSameCell = colIndex === this.selectionStartCell.colIndex;
    if (isSameCell) {
      return;
    }

    const isLeftToRightSelection = this.selectionStartCell.colIndex < colIndex;
    const startIndex = isLeftToRightSelection
      ? this.selectionStartCell.colIndex
      : colIndex;
    const endIndex = isLeftToRightSelection
      ? colIndex
      : this.selectionStartCell.colIndex;

    for (let i = startIndex; i <= endIndex; i++) {
      this.selectCell(cellType, i, rowIndex);
    }
  };

  clearCellsSelection = () => {
    this.headers.forEach(headerRow =>
      headerRow.map(h => {
        h.isSelected = false;
        return h;
      })
    );

    this.dataSource.data.forEach((dataRow: any) => {
      Object.keys(dataRow).map((cell: any) => {
        if (dataRow[cell].hasOwnProperty('isSelected')) {
          dataRow[cell].isSelected = false;
        };
        return cell;
      })
    }
    );
  };

  isSelectionCell = (cell: any): boolean => {
    return cell ? cell.hasOwnProperty('isSelected') : false;
  }

  handleError = (e: any) => {
    console.log("handleError", e);
  };

  getTimeSlotDisplayValue = (row: any, code: any) => {
    if (!row[code]) {
      return null;
    }
    if (row[code].isSelectionCell) {
      return "";
    }
    if (row[code].value) {
      return row[code].value;
    }
    // user name cell case
    if (typeof row[code] === "string") {
      return row[code];
    }
    return "NA";
  };

  //TODO to not span same text on different types
  isSameTimeslot = (t1: any, t2: any): boolean => {
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
  getRowSpan = (row: any, colIndex: any, isFirst: any, isLast: any) => {
    const code = this.headersCodes[0][colIndex];
    try {
      //CHANGE_EFFECT
      const isSelectionCell = row[code].isSelectionCell ? true : false;

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

  getRowClasses = (row: any, colIndex: any, isFirst: any, isLast: any) => {
    const code = this.headersCodes[0][colIndex];
    const classes = [];
    const rowSpan = this.getRowSpan(row, colIndex, isFirst, isLast);
    const category = row[code].category ? row[code].category : null;
    const isSelected = row[code].isSelectionCell ? row[code].isSelected : false;

    if (category) classes.push(category);
    if (rowSpan === 0) {
      classes.push("hidden");
    }
    if (this.HIDE && row[code].isSelectionCell) {
      classes.push("hidden");
    }
    if (isSelected) {
      classes.push("selected");
    }
    return classes;
  };
}
