import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {StorybookRoutingModule} from './storybook-routing.module';


import { StorybookComponent } from './storybook.component';
import { StoryOneComponent } from './story-one/story-one.component';
import { StoryTwoComponent } from './story-two/story-two.component';
import { StoryThreeComponent } from './story-three/story-three.component';
import { StoryFourComponent } from './story-four/story-four.component';
import { HeaderComponent } from './header/header.component';
import {InitialModalComponent} from './initial-modal/initial-modal.component';
import {FinalModalComponent} from './final-modal/final-modal.component';


import * as bowser from 'bowser';
import * as bootstrap from 'bootstrap';
import {InitialModalService} from './initial-modal/initial-modal.service';
import {FinalModalService} from './final-modal/final-modal.service';
declare var jQuery: any;

@NgModule({
  declarations: [
    StorybookComponent,
    StoryOneComponent,
    StoryTwoComponent,
    StoryThreeComponent,
    StoryFourComponent,
    HeaderComponent,
    InitialModalComponent,
    FinalModalComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StorybookRoutingModule
  ],
  providers: [
    InitialModalService,
    FinalModalService
  ]
})
export class StorybookModule { }
