import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { SettingsComponent } from './settings/settings.component';
import { TimeslotPickerComponent } from './timeslot-picker/timeslot-picker.component';
import { SchedulerV2Component } from './scheduler-v2.component';

import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    SchedulerComponent,
    SettingsComponent,
    TimeslotPickerComponent,
    SchedulerV2Component
  ],
  exports: [
    SchedulerV2Component
  ],
})
export class SchedulerV2Module { }