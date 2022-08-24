import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { MaterialModule } from './material.module';

// Components
import { SharedTableComponent } from './../views/shared-table/shared-table.component';


@NgModule({
  declarations: [SharedTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule
  ],
  exports: [SharedTableComponent]
})
export class SharedModule { }
