import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SchedulerV2Module } from './scheduler-v2/scheduler-v2.module';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  imports: [BrowserModule, FormsModule, SchedulerV2Module, MatButtonModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
