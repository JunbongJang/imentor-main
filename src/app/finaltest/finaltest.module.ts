import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinaltestComponent } from './finaltest.component';
import { SpeakingTestComponent } from './speaking-test/speaking-test.component';
import { WritingTestComponent } from './writing-test/writing-test.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FinaltestRoutingModule} from './finaltest-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FinaltestRoutingModule
  ],
  declarations: [FinaltestComponent, SpeakingTestComponent, WritingTestComponent]
})
export class FinaltestModule { }
