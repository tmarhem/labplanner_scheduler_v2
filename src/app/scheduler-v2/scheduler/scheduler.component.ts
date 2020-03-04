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
  selectionStartCell!: {
    cellType: string,
    rowIndex: number;
    colIndex: number;
    isChecking: boolean;
  };
  dataSource!: MatTableDataSource<any>;

  isSelecting = false;
  isChecking = true;
  HIDE = false; // WIP for isComplexModeEnabled

  constructor(
    public notifService: SchedulerNotificationService
  ) { }

  ngOnInit() {
    console.log("SchedulerComponent -> rows", this.rows)
    this.notifService.genericAction.subscribe(this.handleError);
    this.dataSource = new MatTableDataSource<any>(this.rows);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = this.filterPredicate;
    this.headersCodes = this.headers.map(headerRow =>
      headerRow.map(header => header.code)
    );
  }


  filterPredicate = (data: any, filter: any) => {
    // TODO regex to allow typing the end of the name
    // TODO avoid filtering selection cell Row OR Filtering only in selection mode
    const dataStr = JSON.stringify(data).toLowerCase();
    return (
      dataStr.indexOf(`"value":"${filter}`) != -1 &&
      dataStr.indexOf(`"user":"${filter}`) === -1
    );
  };
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
  onMouseDown = (
    cellType: string,
    colIndex: number,
    rowIndex: number,
    ctrlKey: boolean,
    colSpan: number
  ) => {
    try {
      let index = colIndex;
      do {
        const activeCell = this.getActiveCell('DATA', index, rowIndex)
        if (activeCell.hasOwnProperty('isSplitted')) {
          activeCell.isSplitted = true;
        }

        index++;
      }
      while (index < colIndex + colSpan)
      // if ( activeCell.hasOwnProperty('isSplitted')) { 
      //   for ( let i = colIndex; i < colIndex + colSpan - 1; i++ ) {

      //   }

      // }
      // const activeCell = this.getActiveCell(cellType, colIndex, rowIndex);
      // if (!this.isSelectionCell(activeCell)) {
      //   this.stopSelection();
      //   return;
      // }
      // this.isSelecting = true;
      // this.selectionStartCell = {
      //   cellType: cellType,
      //   rowIndex: rowIndex,
      //   colIndex: colIndex,
      //   isChecking: !activeCell.isSelected
      // };

      // if (!ctrlKey) {
      //   this.clearCellsSelection();
      // }

      // this.selectCell(cellType, colIndex, rowIndex);
    } catch (e) {
      this.handleError(e);
    }
  };

  onMouseEnter = (
    cellType: string,
    colIndex: number,
    rowIndex: number
  ) => {
    try {
      if (!this.isSelecting) { return };

      const isSameRow = this.selectionStartCell != null ?
        this.selectionStartCell.rowIndex === rowIndex : true;
      const isSameCellType = this.selectionStartCell != null ?
        this.selectionStartCell.cellType === cellType : true;

      if (!isSameRow || !isSameCellType) {
        this.stopSelection();
      } else {
        this.fillCellSelection(cellType, colIndex, rowIndex);
      }


    } catch (e) {
      this.handleError(e);
    }
  };

  stopSelection = () => {
    this.isSelecting = false;
  }

  selectCell = (
    cellType: string,
    colIndex: number,
    rowIndex: number
  ): void => {
    const activeCell = this.getActiveCell(cellType, colIndex, rowIndex);
    if (activeCell == null) { throw new Error(`selectCell: invalid activeCell: ${activeCell}`) }
    activeCell.isSelected = this.selectionStartCell.isChecking
  };

  getActiveCell = (cellType: string, colIndex: number, rowIndex: number) => {
    if (colIndex == null || rowIndex == null) {
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
      return row[code].isSplitted ? row[code].value.charAt(0) : row[code].value;
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
      if (row[code].hasOwnProperty('isSplitted')) {
        if (row[code].isSplitted) {
          return 1;
        }
      }
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

    // if (category) classes.push(category);
    if (rowSpan === 0) {
      classes.push("hidden");
    }
    if (this.HIDE && row[code].isSelectionCell) {
      // classes.push("hidden");
    }
    if (isSelected) {
      classes.push("selected");
    }
    return classes;
  };

  getRowDivClasses = (row: any, colIndex: any, isFirst: any, isLast: any) => {
    const code = this.headersCodes[0][colIndex];
    const classes = [];
    const rowSpan = this.getRowSpan(row, colIndex, isFirst, isLast);
    const category = row[code].category ? row[code].category : null;
    const isSelected = row[code].isSelectionCell ? row[code].isSelected : false;

    classes.push('cellDiv');
    if (category) classes.push(category);
    // if (rowSpan === 0) {
    //   classes.push("hidden");
    // }
    // if (this.HIDE && row[code].isSelectionCell) {
    //   // classes.push("hidden");
    // }
    // if (isSelected) {
    //   classes.push("selected");
    // }
    return classes;
  };
}
