import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../core/user.service';
import {ViewStateService} from '../../core/view-state.service';

@Component({
  selector: 'story-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService,
              private router: Router,
              private route: ActivatedRoute,
              public viewStateService: ViewStateService) {

  }

  ngOnInit() {
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

  decideMainViewString() {
    const a_view = this.viewStateService.view_state;
    let main_view_string = '';
    if (a_view === this.viewStateService.STORYBOOK_ONE) {
      main_view_string = 'storybook 1';
    } else if (a_view === this.viewStateService.STORYBOOK_TWO) {
      main_view_string = 'storybook 2';
    } else if (a_view === this.viewStateService.STORYBOOK_THREE) {
      main_view_string = 'storybook 3';
    } else if (a_view === this.viewStateService.STORYBOOK_FOUR) {
      main_view_string = 'storybook 4';
    }

    return main_view_string;
  }

}
