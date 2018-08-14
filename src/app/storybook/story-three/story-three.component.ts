import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../shared/view-state.service';

@Component({
  selector: 'story-three',
  templateUrl: './story-three.component.html',
  styleUrls: ['./story-three.component.css']
})
export class StoryThreeComponent implements OnInit {

  constructor(private viewStateService: ViewStateService) { }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_THREE;
  }

}
