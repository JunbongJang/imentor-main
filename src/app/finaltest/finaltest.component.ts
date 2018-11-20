import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {ViewStateService} from '../core/view-state.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'finaltest',
  templateUrl: './finaltest.component.html',
  styleUrls: ['./finaltest.component.css']
})
export class FinaltestComponent implements OnInit {

  constructor(private titleService: Title,
              public userService: UserService,
              public viewStateService: ViewStateService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    document.body.style.backgroundColor = 'rgb(88, 73, 53)';
    this.titleService.setTitle( 'i-MENTOR Storybook' );
  }

  viewStateChoose(a_view: string) {
    if (a_view === this.viewStateService.IMENTOR_MAIN) {
      this.viewStateService.view_state = a_view;
      this.router.navigate(['main']);
    }

    if (this.viewStateService.view_state !== a_view && this.userService.master_status === 'true') {
      this.viewStateService.view_state = a_view;
      this.router.navigate([a_view], {relativeTo: this.route});
    }
  }

}
