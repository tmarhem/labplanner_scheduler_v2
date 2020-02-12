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
  constructor() { }

  ngOnInit() {
    this.secondHeadersList = this.headers[1].map( h => h.code);
    console.log('where', this.secondHeadersList);
        console.log('where', this.headers[0]);

  }

  getValue = (element, header) => {
    if (element[header].value) return element[header].value;
    if (typeof element[header] === 'string') return element[header];
    return 'NA';
  }

}