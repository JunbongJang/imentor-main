import { Component } from '@angular/core';
import {ViewStateService} from './shared/view-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private viewStateService: ViewStateService) {
    this.viewStateService.view_state = this.viewStateService.IMENTOR_MAIN;
  }
}
