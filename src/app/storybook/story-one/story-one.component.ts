import { Component, OnInit } from '@angular/core';
import {ViewStateService} from '../../shared/view-state.service';

@Component({
  selector: 'story-one',
  templateUrl: './story-one.component.html',
  styleUrls: ['./story-one.component.css']
})
export class StoryOneComponent implements OnInit {

  constructor(private viewStateService: ViewStateService) { }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_ONE;
  }

}
