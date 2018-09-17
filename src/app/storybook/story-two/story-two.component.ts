import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';

@Component({
  selector: 'story-two',
  templateUrl: './story-two.component.html',
  styleUrls: ['./story-two.component.css']
})
export class StoryTwoComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService,
              private questionGenerateService: QuestionGenerateService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_TWO;
    this.userService.step = 'storybook2';
    this.questionGenerateService.getQuestionFromServer(this.userService.step);
  }

}
