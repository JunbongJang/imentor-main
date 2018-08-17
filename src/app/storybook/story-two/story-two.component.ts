import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'story-two',
  templateUrl: './story-two.component.html',
  styleUrls: ['./story-two.component.css']
})
export class StoryTwoComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_TWO;
    this.userService.step = 'storybook2';
    this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section).subscribe(
      (question_xml_string) => {
        console.log('GetQuestion Storybook2: ');
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
