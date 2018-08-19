import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ViewStateService} from '../core/view-state.service';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {current} from '../../../node_modules/codelyzer/util/syntaxKind';
import {ServerService} from '../core/server.service';
declare var $: any;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  NUM_BOOK_TOTAL = 24;
  NUM_BOOK_LIST = [];
  book_select_num = 1;
  step_num = 1; //1 equals vocabulary1, 18 equals writing test

  constructor(public router: Router,
              private viewStateService: ViewStateService,
              public userService: UserService,
              private titleService: Title,
              private serverService: ServerService) { }

  ngOnInit() {
    document.body.style.backgroundColor = 'rgb(241,210,83)';
    this.titleService.setTitle( 'i-MENTOR Home' );

    $(".select_bx").hide();
    for (let i = 1; i <= 24; i++) {
      this.NUM_BOOK_LIST.push(i);
    }
  }

  viewStateChoose(a_view: string, clicked_step_category: string, clicked_step: string) {
    this.updateUserState(clicked_step_category, clicked_step);
    if (this.viewStateService.view_state !== a_view) {
      this.viewStateService.view_state = a_view;
      this.router.navigate([clicked_step_category + '/' + a_view]);
    }
  }

  updateUserState (clicked_step_category: string, clicked_step: string) {
    // sample url parameters:
    // uid=1000050540&user_id=test123456&ho=1&step=storybook1&section=2&master=true
    this.userService.step = clicked_step_category + clicked_step;
    this.userService.section = '';

    let open_url = '';
    if (clicked_step_category === 'vocabulary') {
      open_url = `/IMENTOR/vocabulary/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=vocabulary${clicked_step}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'grammar') {
      open_url = `/IMENTOR/grammar/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=grammer${clicked_step}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'storybook') {
      if (clicked_step === '1') {
        this.userService.section = this.userService.jindo.current_storybook1;
      } else if (clicked_step === '2') {
        this.userService.section = this.userService.jindo.current_storybook2;
      } else if (clicked_step === '3') {
        this.userService.section = this.userService.jindo.current_storybook3;
      } else if (clicked_step === '4') {
        this.userService.section = this.userService.jindo.current_storybook4;
      }
      if (isNaN(parseInt(this.userService.section, 10))) {
        this.userService.section = '1';
      } else {
        this.userService.section = String(parseInt(this.userService.section, 10) + 1);
      }

      open_url = `/IMENTOR/sub.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=storybook${clicked_step}&section=${this.userService.section}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'speaking') {
      if (clicked_step === '1') {
        this.userService.section = this.userService.jindo.current_speaking1;
      } else if (clicked_step === '2') {
        this.userService.section = this.userService.jindo.current_speaking2;
      } else if (clicked_step === '3') {
        this.userService.section = this.userService.jindo.current_speaking3;
      }

      if (isNaN(parseInt(this.userService.section, 10))) {
        this.userService.section = '1';
      } else {
        this.userService.section = String(parseInt(this.userService.section, 10) + 1);
      }
      open_url = `/IMENTOR/speaking/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=speaking${clicked_step}&section=${this.userService.section}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'finaltest') {
      let current_kind = '';
      if (clicked_step === '1') {
        current_kind = 'speaking';
      } else if (clicked_step === '2') { // this.userService.jindo.current_finaltest
        current_kind = 'writing';
      }
      open_url = `/IMENTOR/my-result-final.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=finaltest&kind=${current_kind}&master=${this.userService.master_status}`;
    }
    return open_url;
  }

  openPopup( clicked_step_category: string, clicked_step: string) {
    const open_url = this.updateUserState(clicked_step_category, clicked_step);
    window.open(open_url, '_blank');
  }

  closeChooseBook() {
    $(".select_bx").hide();
  }

  openChooseBook() {
    $(".select_bx").show();
  }

  chooseBook() {
    this.userService.ho = String(this.book_select_num);
    this.closeChooseBook();
    this.userService.setJindoFromServer();
  }

  decideOpenStep(step: string) {
    if (step === 'vocabulary1') {
      this.step_num = 1;
    } else if (step === 'vocabulary2') {
      this.step_num = 2;
    } else if (step === 'vocabulary3') {
      this.step_num = 3;
    } else if (step === 'vocabulary4') {
      this.step_num = 4;
    } else if (step === 'grammer1') {
      this.step_num = 5;
    } else if (step === 'grammer2') {
      this.step_num = 6;
    } else if (step === 'grammer3') {
      this.step_num = 7;
    } else if (step === 'grammer4') {
      this.step_num = 8;
    } else if (step === 'grammer5') {
      this.step_num = 9;
    } else if (step === 'storybook1') {
      this.step_num = 10;
    } else if (step === 'storybook2') {
      this.step_num = 11;
    } else if (step === 'storybook3') {
      this.step_num = 12;
    } else if (step === 'storybook4') {
      this.step_num = 13;
    } else if (step === 'speaking1') {
      this.step_num = 14;
    } else if (step === 'speaking2') {
      this.step_num = 15;
    } else if (step === 'speaking3') {
      this.step_num = 16;
    } else if (step === 'finaltest') {
      this.step_num = 18;
    } else {
      this.step_num = 18;
    }
  }

}
