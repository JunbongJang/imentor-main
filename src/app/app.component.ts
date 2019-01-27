import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
    const url = new URL(window.location.href);
    console.log(window.location.href);
  }

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
