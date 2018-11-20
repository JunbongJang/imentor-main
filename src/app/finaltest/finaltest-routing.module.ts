import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FinaltestComponent} from './finaltest.component';
import {WritingTestComponent} from './writing-test/writing-test.component';
import {SpeakingTestComponent} from './speaking-test/speaking-test.component';


const finaltestRoutes: Routes = [
  { path: '', component: FinaltestComponent, data: { state: 'finaltest' }, children: [
      { path: 'writing', component: WritingTestComponent },
      { path: 'speaking', component: SpeakingTestComponent }
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(finaltestRoutes)
  ],
  exports: [RouterModule]
})
export class FinaltestRoutingModule { }
