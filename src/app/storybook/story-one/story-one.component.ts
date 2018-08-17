import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';

@Component({
  selector: 'story-one',
  templateUrl: './story-one.component.html',
  styleUrls: ['./story-one.component.css']
})
export class StoryOneComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_ONE;
    this.userService.step = 'storybook1';
    this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section).subscribe(
      (question_xml_string) => {
        console.log('GetQuestion Storybook1: ');
        const parser = new DOMParser();
        const parsed_xml = parser.parseFromString(question_xml_string, 'text/xml');
        console.log(parsed_xml);

        const question_xml = parsed_xml.getElementsByTagName('question')[0];
        for (let i = 0; question_xml.getElementsByTagName('eng')[i] !== undefined; i++) {
          console.log(question_xml.getElementsByTagName('eng')[i].childNodes[0].nodeValue);
          if (question_xml.getElementsByTagName('o_word')[i].childNodes[0] !== undefined) {
            console.log(question_xml.getElementsByTagName('o_word')[i].childNodes[0].nodeValue);
          }
          if (question_xml.getElementsByTagName('x_word')[i].childNodes[0] !== undefined) {
            console.log(question_xml.getElementsByTagName('x_word')[i].childNodes[0].nodeValue);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
