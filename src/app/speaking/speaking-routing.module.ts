import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SpeakingComponent} from './speaking.component';
import {SpeakingOneComponent} from './speaking-one/speaking-one.component';
import {SpeakingThreeComponent} from './speaking-three/speaking-three.component';


const speakingRoutes: Routes = [
  { path: '', component: SpeakingComponent, data: { state: 'speaking' }, children: [
      { path: 'speaking-one', component: SpeakingOneComponent },
      { path: 'speaking-two', component: SpeakingOneComponent },
      { path: 'speaking-three', component: SpeakingThreeComponent }
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(speakingRoutes)
  ],
  exports: [RouterModule]
})
export class SpeakingRoutingModule { }
