import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { SchedulerV2Module } from './scheduler-v2/scheduler-v2.module';
import {MatButtonModule} from '@angular/material/button';

import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';


@NgModule({
  imports:      [ BrowserModule, FormsModule, SchedulerV2Module, MatButtonModule ],
  declarations: [ AppComponent, HelloComponent ],
  bootstrap:    [ AppComponent ],
})
export class AppModule { }
