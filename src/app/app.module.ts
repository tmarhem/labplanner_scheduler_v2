import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { SchedulerV2Module } from './scheduler-v2/scheduler-v2.module'
@NgModule({
  imports:      [ BrowserModule, FormsModule, SchedulerV2Module ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
