import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewStateService} from '../core/view-state.service';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {current} from '../../../node_modules/codelyzer/util/syntaxKind';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  constructor(public router: Router,
              private viewStateService: ViewStateService,
              private userService: UserService,
              private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle( 'i-MENTOR Home' );
  }

  viewStateChoose(a_view: string, parent_path: string) {
    if (this.viewStateService.view_state !== a_view) {
      this.viewStateService.view_state = a_view;
      this.router.navigate([parent_path + a_view]);
    }
  }

  openPopup( clicked_step_category: string, clicked_step: string) {
    // sample url parameters:
    // uid=1000050540&user_id=test123456&ho=1&step=storybook1&section=2&master=true
    this.userService.ho = this.userService.user.level;
    this.userService.step = clicked_step_category + clicked_step;
    this.userService.section = '';

    let open_url = '';
    if (clicked_step_category === 'vocabulary') {
      open_url = `/IMENTOR/vocabulary/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=vocabulary${clicked_step}&master=${this.userService.master_status}`;
    } else if (clicked_step_category === 'grammar') {
      open_url = `/IMENTOR/grammar/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=grammer${clicked_step}&master=${this.userService.master_status}`;
    } else if (clicked_step_category === 'storybook') {
      let current_section = '';
      if (clicked_step === '1') {
        current_section = this.userService.jindo.current_storybook1;
      } else if (clicked_step === '2') {
        current_section = this.userService.jindo.current_storybook2;
      } else if (clicked_step === '3') {
        current_section = this.userService.jindo.current_storybook3;
      } else if (clicked_step === '4') {
        current_section = this.userService.jindo.current_storybook4;
      }
      if (isNaN(parseInt(current_section, 10))) {
        current_section = '1';
      } else {
        current_section = String(parseInt(current_section, 10) + 1);
      }

      open_url = `/IMENTOR/sub.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=storybook${clicked_step}&section=${current_section}&master=${this.userService.master_status}`;
    } else if (clicked_step_category === 'speaking') {
      let current_section = '';
      if (clicked_step === '1') {
        current_section = this.userService.jindo.current_speaking1;
      } else if (clicked_step === '2') {
        current_section = this.userService.jindo.current_speaking2;
      } else if (clicked_step === '3') {
        current_section = this.userService.jindo.current_speaking3;
      }

      if (isNaN(parseInt(current_section, 10))) {
        current_section = '1';
      } else {
        current_section = String(parseInt(current_section, 10) + 1);
      }
      open_url = `/IMENTOR/speaking/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=speaking${clicked_step}&section=${current_section}&master=${this.userService.master_status}`;
    } else if (clicked_step_category === 'finaltest') {
      let current_kind = '';
      if (this.userService.jindo.current_finaltest === '1') {
        current_kind = 'speaking';
      } else if (this.userService.jindo.current_finaltest  === '2') {
        current_kind = 'writing';
      }
      open_url = `/IMENTOR/my-result-final.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=finaltest&kind=${current_kind}&master=${this.userService.master_status}`;
    }

    window.open(open_url, '_blank');
  }

}
