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

import {InitialModalService} from './initial-modal/initial-modal.service';
import {FinalModalService} from './final-modal/final-modal.service';

import {QuestionGenerateService} from './question/question-generate.service';
import {QuestionStorageService} from './question/question-storage.service';
import {QuestionGradeService} from './question/question-grade.service';
import {QuestionSoundService} from './question/question-sound.service';
import {GeneralUtilityService} from '../core/general-utility.service';

import * as bowser from 'bowser';
import * as bootstrap from 'bootstrap';
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
    FinalModalService,
    QuestionGenerateService,
    QuestionStorageService,
    QuestionGradeService,
    QuestionSoundService,
    GeneralUtilityService
  ]
})
export class StorybookModule { }
