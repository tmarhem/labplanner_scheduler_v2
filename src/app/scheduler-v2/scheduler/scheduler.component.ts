import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  @Input() headers: Array<string>;
  @Input() rows: Array<any>;

  constructor() { }

  ngOnInit() {
  }

  getValue = (element, header) => {
    if (element[header].value) return element[header].value;
    if (typeof element[header] === 'string') return element[header];
    return 'NA';
  }

}