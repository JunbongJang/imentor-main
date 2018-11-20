import { SpeakingComponent } from './speaking.component';
import { SpeakingOneComponent } from './speaking-one/speaking-one.component';
import { SpeakingThreeComponent } from './speaking-three/speaking-three.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SpeakingRoutingModule} from './speaking-routing.module';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';


@NgModule({
  declarations: [SpeakingComponent, SpeakingOneComponent, SpeakingThreeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SpeakingRoutingModule
  ],
})
export class SpeakingModule { }
