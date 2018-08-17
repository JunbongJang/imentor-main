import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'story-four',
  templateUrl: './story-four.component.html',
  styleUrls: ['./story-four.component.css']
})
export class StoryFourComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_FOUR;
    this.userService.step = 'storybook4';
    this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section).subscribe(
      (question_xml_string) => {
        console.log('GetQuestion Storybook4: ');
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
