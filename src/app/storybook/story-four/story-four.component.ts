import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';

@Component({
  selector: 'story-four',
  templateUrl: './story-four.component.html',
  styleUrls: ['./story-four.component.css']
})
export class StoryFourComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService,
              private questionGenerateService: QuestionGenerateService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_FOUR;
    this.userService.step = 'storybook4';
    this.questionGenerateService.getQuestionFromServer();
  }

}
