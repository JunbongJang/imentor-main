import { NgModule } from '@angular/core';
import {StorybookComponent} from './storybook.component';
import {RouterModule, Routes} from '@angular/router';
import {StoryOneComponent} from './story-one/story-one.component';
import {StoryTwoComponent} from './story-two/story-two.component';
import {StoryThreeComponent} from './story-three/story-three.component';
import {StoryFourComponent} from './story-four/story-four.component';

const storybookRoutes: Routes = [
  { path: '', component: StorybookComponent, data: { state: 'storybook' }, children: [
      { path: 'story-one', component: StoryOneComponent },
      { path: 'story-two', component: StoryTwoComponent },
      { path: 'story-three', component: StoryThreeComponent },
      { path: 'story-four', component: StoryFourComponent },
    ]},
];

@NgModule({
  imports: [
    RouterModule.forChild(storybookRoutes)
  ],
  exports: [RouterModule]
})
export class StorybookRoutingModule { }
