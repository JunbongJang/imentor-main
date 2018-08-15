import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';

@Component({
  selector: 'story-one',
  templateUrl: './story-one.component.html',
  styleUrls: ['./story-one.component.css']
})
export class StoryOneComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_ONE;
    this.serverService.getQuestionFromServer('storybook1', '1', '2').subscribe(
      (a_result) => {
        console.log(a_result);
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
