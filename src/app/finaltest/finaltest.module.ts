import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinaltestComponent } from './finaltest.component';
import { SpeakingTestComponent } from './speaking-test/speaking-test.component';
import { WritingTestComponent } from './writing-test/writing-test.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FinaltestRoutingModule} from './finaltest-routing.module';
import {FinaltestService} from './finaltest.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FinaltestRoutingModule
  ],
  declarations: [FinaltestComponent, SpeakingTestComponent, WritingTestComponent],
  providers: [
    FinaltestService
  ]
})
export class FinaltestModule { }
