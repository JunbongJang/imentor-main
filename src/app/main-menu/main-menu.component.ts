import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {ViewStateService} from '../core/view-state.service';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {ServerService} from '../core/server.service';
import {Subscription} from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit, OnDestroy {

  public character_url = '';
  public book_url = '';

  NUM_BOOK_TOTAL = 24;
  NUM_BOOK_LIST = [];
  book_select_num = 1;

  step_num = 1; // 1 equals vocabulary1, 18 equals writing test

  userInitlizedSubscription: Subscription;

  constructor(public router: Router,
              private viewStateService: ViewStateService,
              public userService: UserService,
              private titleService: Title,
              private serverService: ServerService,
              private renderer: Renderer2) { }

  ngOnInit() {
    console.log('ngOnInit main menu~~~~~~~~~~~');
    const url = new URL(window.location.href);
    // url.host.indexOf('localhost') !== 0 &&
    // initialize user if it's not localhost

    if (this.userService.user_initialized_bool === false) {

      this.userService.setUserFromServer();
      this.userInitlizedSubscription = this.userService.userInitialized.subscribe(() => {
        this.setJindoFromServer(this.userService.step, this.userService.ho);
        this.setCharacterImage();
        this.setBookImage();
      },
        (error) => {
          console.log(error);
        });
    } else {
      this.setJindoFromServer(this.userService.step, this.userService.ho); // this is needed when going from storybook to main by finish
      this.setCharacterImage();
      this.setBookImage();
    }

    document.body.style.backgroundColor = 'rgb(241,210,83)';
    this.titleService.setTitle( 'i-MENTOR Home' );

    $('.select_bx').hide();
    for (let i = 1; i <= this.NUM_BOOK_TOTAL; i++) {
      this.NUM_BOOK_LIST.push(i);
    }
  }

  ngOnDestroy() {
    console.log('destroy!!!');
    if (this.userInitlizedSubscription !== undefined) {
      this.userInitlizedSubscription.unsubscribe();
    }
  }

  viewStateChoose(a_view: string, clicked_step_category: string, clicked_step: string, step_num: number) {
    console.log('viewStateChoose');
    console.log(a_view);
    console.log(clicked_step);
    console.log(clicked_step_category);
    if (this.checkMasterPerm() || this.step_num >= step_num) {
      this.updateUserState(clicked_step_category, clicked_step);
      if (this.viewStateService.view_state !== a_view) {
        this.viewStateService.view_state = a_view;
        this.router.navigate([clicked_step_category + '/' + a_view]);
      }
    } else {
      alert('Finish previous sections first!');
    }
  }

  /**
   * @param clicked_step_category
   * @param clicked_step_num
   * @param step_num represents the supposed step number of the study
   */
  openPopup( clicked_step_category: string, clicked_step_num: string, step_num: number) {
    console.log('openPopup: ' + step_num + '   ' + this.step_num);
    if (this.checkMasterPerm() || this.step_num >= step_num) {
      const open_url = this.updateUserState(clicked_step_category, clicked_step_num);
      window.open(open_url, '_blank');
    } else {
      alert('Finish previous sections first!');
    }
  }

  updateUserState (clicked_step_category: string, clicked_step: string) {
    // sample url parameters:
    // uid=1000050540&user_id=test123456&ho=1&step=storybook1&section=2&master=true
    this.userService.step = clicked_step_category + clicked_step;
    this.userService.section = '';

    let open_url = '';
    if (clicked_step_category === 'vocabulary') {  // ----------------------- vocabulary -------------------------------------
      open_url = `/IMENTOR/cn/vocabulary/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=vocabulary${clicked_step}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'grammar') { // ----------------------- grammar -------------------------------------
      open_url = `/IMENTOR/cn/grammar/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=grammer${clicked_step}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'storybook') { // ----------------------- storybook -------------------------------------
      let temp_max_section = '';
      if (clicked_step === '1') {
        this.userService.section = this.userService.jindo.current_storybook1;
        temp_max_section = this.userService.jindo.max_storybook1;
      } else if (clicked_step === '2') {
        this.userService.section = this.userService.jindo.current_storybook2;
        temp_max_section = this.userService.jindo.max_storybook2;
      } else if (clicked_step === '3') {
        this.userService.section = this.userService.jindo.current_storybook3;
        temp_max_section = this.userService.jindo.max_storybook3;
      } else if (clicked_step === '4') {
        this.userService.section = this.userService.jindo.current_storybook4;
        temp_max_section = this.userService.jindo.max_storybook4;
      }
      if (isNaN(parseInt(this.userService.section, 10))) {
        this.userService.section = '1';
      } else {
        if (parseInt(this.userService.section, 10) < parseInt(temp_max_section, 10)) {
          this.userService.section = String(parseInt(this.userService.section, 10) + 1);
        }
      }

      open_url = `/IMENTOR/cn/sub.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=storybook${clicked_step}&section=${this.userService.section}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'speaking') { // ----------------------- speaking -------------------------------------
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
      open_url = `/IMENTOR/cn/speaking/?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=speaking${clicked_step}&section=${this.userService.section}&master=${this.userService.master_status}`;

    } else if (clicked_step_category === 'finaltest') {
      let current_kind = '';
      if (clicked_step === '1') {
        current_kind = 'speaking';
      } else if (clicked_step === '2') { // this.userService.jindo.current_finaltest
        current_kind = 'writing';
      }
      open_url = `/IMENTOR/cn/my-result-final.html?uid=${this.userService.user.uid}&user_id=${this.userService.user.user_id}&ho=${this.userService.ho}&step=finaltest&kind=${current_kind}&master=${this.userService.master_status}`;
    }
    return open_url;
  }


  closeChooseBook() {
    $('.select_bx').hide();
  }

  openChooseBook() {
    $('.select_bx').show();
  }

  chooseBook() {
    this.userService.ho = String(this.book_select_num);
    this.setJindoFromServer(this.userService.step, this.userService.ho);
    this.setCharacterImage();
    this.setBookImage();
    this.closeChooseBook();
  }

  setOpenStep(step: string) {
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

  setCharacterImage() {
    this.character_url = '/IMENTOR/img/illust/' + this.userService.ho + '.png';
    console.log('setCharacterImage!');
  }

  setBookImage() {
    this.book_url = '/IMENTOR/img/book/' + this.userService.ho + '.png';
  }

  setJindoFromServer(a_step: string, a_ho: string) {
    this.serverService.getJindoFromServer('', a_ho).subscribe(
      (jindo_xml_string) => {
        console.log('getJindoFromServer: ');
        const parser = new DOMParser();
        const jindo_xml = parser.parseFromString(jindo_xml_string, 'text/xml');
        console.log(jindo_xml);

        this.userService.jindo.book_title = jindo_xml.getElementsByTagName('book_title')[0].childNodes[0].nodeValue;
        this.userService.jindo.level = jindo_xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
        this.userService.jindo.step = jindo_xml.getElementsByTagName('step')[0].childNodes[0].nodeValue;
        if ( jindo_xml.getElementsByTagName('section')[0].childNodes[0] !== undefined) {
          this.userService.jindo.section = jindo_xml.getElementsByTagName('section')[0].childNodes[0].nodeValue;
        }
        this.userService.jindo.current_storybook1 = jindo_xml.getElementsByTagName('section_storybook1')[0].getAttribute('thisJindo');
        this.userService.jindo.current_storybook2 = jindo_xml.getElementsByTagName('section_storybook2')[0].getAttribute('thisJindo');
        this.userService.jindo.current_storybook3 = jindo_xml.getElementsByTagName('section_storybook3')[0].getAttribute('thisJindo');
        this.userService.jindo.current_storybook4 = jindo_xml.getElementsByTagName('section_storybook4')[0].getAttribute('thisJindo');
        this.userService.jindo.current_speaking1 = jindo_xml.getElementsByTagName('section_speaking1')[0].getAttribute('thisJindo');
        this.userService.jindo.current_speaking2 = jindo_xml.getElementsByTagName('section_speaking2')[0].getAttribute('thisJindo');
        this.userService.jindo.current_speaking3 = jindo_xml.getElementsByTagName('section_speaking3')[0].getAttribute('thisJindo');
        this.userService.jindo.current_finaltest = jindo_xml.getElementsByTagName('section_finaltest')[0].getAttribute('thisJindo');

        this.userService.jindo.max_storybook1 = jindo_xml.getElementsByTagName('section_storybook1')[0].getAttribute('maxSection');
        this.userService.jindo.max_storybook2 = jindo_xml.getElementsByTagName('section_storybook2')[0].getAttribute('maxSection');
        this.userService.jindo.max_storybook3 = jindo_xml.getElementsByTagName('section_storybook3')[0].getAttribute('maxSection');
        this.userService.jindo.max_storybook4 = jindo_xml.getElementsByTagName('section_storybook4')[0].getAttribute('maxSection');

        this.userService.jindo.point_vocabulary4 = jindo_xml.getElementsByTagName('point')[0].getAttribute('vocabulary4');
        this.userService.jindo.point_grammar5 = jindo_xml.getElementsByTagName('point')[0].getAttribute('grammer5');
        this.userService.jindo.point_speaking1 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking1');
        this.userService.jindo.point_speaking2 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking2');
        this.userService.jindo.point_speaking3 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking3');
        this.userService.jindo.point_finaltest_speaking = jindo_xml.getElementsByTagName('point')[0].getAttribute('finaltest_speaking');
        this.userService.jindo.point_finaltest_writing = jindo_xml.getElementsByTagName('point')[0].getAttribute('finaltest_writing');
        this.userService.jindo.is_complete = jindo_xml.getElementsByTagName('point')[0].getAttribute('is_complete');

        console.log('point_vocabulary4: ' + this.userService.jindo.point_vocabulary4);
        console.log('point_vocabulary4: ' + typeof this.userService.jindo.point_vocabulary4);
        console.log('point_grammar5: ' + this.userService.jindo.point_grammar5);
        console.log('point_grammar5: ' + typeof (this.userService.jindo.point_grammar5));

        this.setOpenStep(this.userService.jindo.step);
        console.log('----------------------------------------------');
        console.log(this.userService.jindo);
      },
      (error) => {
        console.log('getJindo error');
        console.log(error);
      });
  }

  logoutUser() {
    this.serverService.logoutUser().subscribe(
      (logout_string: string) => {
        console.log('logged out: ' + logout_string);
        window.open('/onacademy/', '_self');
      },
      (error) => {
        console.log('logout error');
        console.log(error);
      });
  }

  checkMasterPerm() {
    return parseInt(this.userService.user.mb_level, 10) > 1;
  }


}
