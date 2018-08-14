import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../shared/view-state.service';

@Component({
  selector: 'story-four',
  templateUrl: './story-four.component.html',
  styleUrls: ['./story-four.component.css']
})
export class StoryFourComponent implements OnInit {

  constructor(private viewStateService: ViewStateService) { }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_FOUR;
  }

}
