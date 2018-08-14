import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../shared/view-state.service';

@Component({
  selector: 'story-two',
  templateUrl: './story-two.component.html',
  styleUrls: ['./story-two.component.css']
})
export class StoryTwoComponent implements OnInit {

  constructor(private viewStateService: ViewStateService) { }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_TWO;
  }

}
