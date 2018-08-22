import {Component, OnInit} from '@angular/core';
import {ViewStateService} from './core/view-state.service';
import {UserService} from './core/user.service';
import {ServerService} from './core/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private userService: UserService,
              private serverService: ServerService) {
  }

  ngOnInit() {
    const url = new URL(window.location.href);
    console.log(window.location.href);
  }

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
