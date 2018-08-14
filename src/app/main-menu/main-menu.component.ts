import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewStateService} from '../shared/view-state.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public router: Router,
              private viewStateService: ViewStateService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( 'i-MENTOR 메인화면' );
  }

  viewStateChoose(a_view: string, parent_path: string) {
    if (this.viewStateService.view_state !== a_view) {
      this.viewStateService.view_state = a_view;
      this.router.navigate([parent_path + a_view]);
    }
  }

}
