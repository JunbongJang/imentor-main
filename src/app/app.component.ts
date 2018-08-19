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

    // initialize user if it's not localhost
    if (url.host.indexOf('localhost') !== 0) {
      this.userService.setUserFromServer();
      this.userService.setJindoFromServer();
    }

  }

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
