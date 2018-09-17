import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';

@Component({
  selector: 'story-three',
  templateUrl: './story-three.component.html',
  styleUrls: ['./story-three.component.css']
})
export class StoryThreeComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService,
              private questionGenerateService: QuestionGenerateService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_THREE;
    this.userService.step = 'storybook3';
    this.questionGenerateService.getQuestionFromServer(this.userService.step);
  }
}
