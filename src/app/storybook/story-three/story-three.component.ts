import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'story-three',
  templateUrl: './story-three.component.html',
  styleUrls: ['./story-three.component.css']
})
export class StoryThreeComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_THREE;
    this.userService.step = 'storybook3';
    this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section).subscribe(
      (question_xml_string) => {
        console.log('GetQuestion Storybook3: ');
        const parser = new DOMParser();
        const parsed_xml = parser.parseFromString(question_xml_string, 'text/xml');
        console.log(parsed_xml);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
