import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulerComponent } from './scheduler/scheduler.component';
import { SettingsComponent } from './settings/settings.component';
import { TimeslotPickerComponent } from './timeslot-picker/timeslot-picker.component';

import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    SchedulerComponent,
    SettingsComponent,
    TimeslotPickerComponent
  ],
  exports: [
    SchedulerComponent,
    SettingsComponent,
    TimeslotPickerComponent
  ]
})
export class SchedulerV2Module { }