import { Component, OnInit } from "@angular/core";
import { agGridData } from "../testData/data";

import { format, isValid } from "date-fns";
import { fr, enGB } from "date-fns/locale";
import { SchedulerParams } from "./_models/schedulerv2.models";

@Component({
  selector: "app-scheduler-v2",
  templateUrl: "./scheduler-v2.component.html",
  styleUrls: ["./scheduler-v2.component.css"]
})
export class SchedulerV2Component implements OnInit {
  input: Array<{ user: string }> = agGridData.result;
  duplicatedInput: Array<any>;
  startDate: Date;
  headers: Array<any>;
  headersList: Array<string>;

  lang = fr;
  PARAMS: SchedulerParams = new SchedulerParams();

  constructor() {
    this.duplicatedInput = [];
    this.startDate = new Date();
    this.headers = [];
    this.headersList = [];
  }

  ngOnInit() {
    this.duplicateInput(this.input);
    this.generateHalfDayHeaders(this.input[0]);
    this.generateDayHeaders(this.headersList);
    this.generateMonthHeaders(this.headersList);
  }

  handleError = (e: any) => {
    console.log("handleError", e);
  };

  /**
   * Fills headers with halfday headers then days headers then month headers
   * rows : a sample of data to get the necessary codes :
   * {user: string, _10022020am: string|TimeSlot, ...}
   */
  generateHalfDayHeaders = (rows: any) => {
    try {
      this.headers = [];
      this.headersList = Object.keys(rows).sort((a, b) => {
        if (a === "user") return -1;
        if (b === "user") return 1;
        return 0;
      });
      this.headers.push(
        this.headersList.map(h => {
          return {
            code: h,
            colSpan: 1,
            // displayValue: this.getDisplayValue(this.getDateFromCode(h), "a"),
            displayValue: '',

            isSelected: false
          };
        })
      );
    } catch (e) {
      this.handleError(e);
    }
  };

  generateDayHeaders = (headersList: any) => {
    try {
      const slicedHeaders = headersList
        .map((h: any) => {
          if (h === "user") return h;
          return h.slice(0, -2);
        })
        .map((h: any) => (h === "user" ? "user2" : h));
      let secondHeaders: any = [];
      slicedHeaders.forEach((h: any) => {
        let index = secondHeaders.findIndex((h2: any) => h2.code === h);
        if (index < 0) {
          secondHeaders.push({
            code: h,
            colSpan: 1,
            displayValue: this.getDisplayValue(this.getDateFromCode(h), "Ed"),
            isSelected: false
          });
        } else {
          secondHeaders[index].colSpan++;
        }
      });
      this.headers.push(secondHeaders);
    } catch (e) {
      this.handleError(e);
    }
  };

  generateMonthHeaders = (headersList: any) => {
    try {
      const slicedHeaders = headersList
        .map((h: any) => {
          if (h === "user") return h;
          return h.slice(3, -2);
        })
        .map((h: any) => (h === "user" ? "user3" : h));
      let thirdHeaders: any = [];
      let index;

      slicedHeaders.forEach((h: any) => {
        let index = thirdHeaders.findIndex((h2: any) => h2.code === h);
        if (index < 0) {
          thirdHeaders.push({
            code: h,
            colSpan: 1,
            displayValue: this.getDisplayValue(
              this.getDateFromCode(h),
              "LLLL y"
            ),
            isSelected: false
          });
        } else {
          thirdHeaders[index].colSpan++;
        }
      });
      this.headers.push(thirdHeaders);
    } catch (e) {
      this.handleError(e);
    }
  };

  duplicateInput = (input: Array<any>) => {
    this.duplicatedInput = [];
    input.forEach(row => {
      this.duplicatedInput.push(row);
      this.duplicatedInput.push(this.emptyRowExceptUser(row));
    });
  };

  emptyRowExceptUser = (row: any) => {
    const clonedRow = Object.assign({}, row);
    for (let prop in row) {
      switch (prop) {
        case "user":
          break;
        default:
          // clonedRow[prop] = "";
          clonedRow[prop] = {
            isSelectionCell: true,
            isSelected: false,
            value: ""
          };

          break;
      }
    }
    return clonedRow;
  };

  getDateFromCode = (code: string): Date | null => {
    let year, month, day, half;
    switch (code.length) {
      case 11:
        half = code.slice(9, 11);
      case 9:
        year = Number(code.slice(5, 9));
        month = Number(code.slice(3, 5));
        day = Number(code.slice(1, 3));
        return new Date(year, month - 1, day, half === "pm" ? 22 : 5);
        break;
      case 6:
        year = Number(code.slice(2));
        month = Number(code.slice(0, 2));
        return new Date(year, month - 1, 1, 5);
        break;
      default:
        return null;
    }
  };

  getDisplayValue = (date: Date | null, pattern?: string) => {
    try {
      if (!isValid(date)) {
        return this.PARAMS.crossHeaderText;
      }
      if (date) {
        return format(date, pattern ? pattern : "P", {
          locale: this.lang
        }).replace(/^\w/, c => c.toUpperCase());
      }
    } catch (e) {
      this.handleError(e);
    }
  };
}

export class TimeSlot {
  category!: string;
  userId!: string;
  value!: string;
  projectId?: string;
}
