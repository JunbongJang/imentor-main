import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {QuestionStorageService} from './question/question-storage.service';
import {UserService} from '../core/user.service';
import {Subject, Subscription} from 'rxjs';
import {StorybookService} from './storybook.service';
import {ViewStateService} from '../core/view-state.service';
import {Router} from '@angular/router';
import {QuestionGenerateService} from './question/question-generate.service';

@Component({
  selector: 'app-storybook',
  templateUrl: './storybook.component.html',
  styleUrls: ['./storybook.component.css']
})
export class StorybookComponent implements OnInit, OnDestroy {

  NUM_SECTION_TOTAL = 0;
  NUM_SECTION_LIST: number[] = [];

  storybookAudioInitializedSubscription: Subscription;
  storybookSceneCompleteSubscription: Subscription;
  user_passed = false;

  constructor(private titleService: Title,
              public questionStorageService: QuestionStorageService,
              private questionGenerateService: QuestionGenerateService,
              public userService: UserService,
              private storybookService: StorybookService,
              private viewStateService: ViewStateService,
              private router: Router) { }

  ngOnInit() {
    this.user_passed = false;
    document.body.style.backgroundColor = 'rgb(88, 73, 53)';
    this.titleService.setTitle( 'i-MENTOR Storybook' );

    this.storybookAudioInitializedSubscription = this.storybookService.storybookAudioInitialize.subscribe((part_num) => {

      if (this.userService.step === 'storybook1') {
        this.NUM_SECTION_TOTAL = parseInt(this.userService.jindo.max_storybook1, 10);
      } else if (this.userService.step === 'storybook2') {
        this.NUM_SECTION_TOTAL = parseInt(this.userService.jindo.max_storybook2, 10);
      } else if (this.userService.step === 'storybook3') {
        this.NUM_SECTION_TOTAL = parseInt(this.userService.jindo.max_storybook3, 10);
      } else if (this.userService.step === 'storybook4') {
        this.NUM_SECTION_TOTAL = parseInt(this.userService.jindo.max_storybook4, 10);
      }

      this.NUM_SECTION_LIST = [];
      for (let i = 1; i <= this.NUM_SECTION_TOTAL; i++) {
        this.NUM_SECTION_LIST.push(i);
      }

      (<HTMLAudioElement>document.getElementById('storybook_audio')).pause();
      (<HTMLAudioElement>document.getElementById('storybook_audio')).currentTime = 0;
      if (part_num === '') {
        this.setStorybookAudio('');
        (<HTMLAudioElement>document.getElementById('storybook_audio')).play();
      } else if (part_num === '1') {
        this.setStorybookAudio('1');
        (<HTMLAudioElement>document.getElementById('storybook_audio')).play();
      } else if (part_num === '2') {
        this.setStorybookAudio('2');
        (<HTMLAudioElement>document.getElementById('storybook_audio')).play();
      }
    },
    (error) => {
      console.log(error);
    });

    this.storybookSceneCompleteSubscription = this.storybookService.storybookSceneComplete.subscribe( (all_correct_bool: boolean) => {

      (<HTMLButtonElement>document.getElementById('storybook_finish_button')).disabled = !all_correct_bool;
      const storybook_element = document.getElementById('storybook_next_button');
      (<HTMLButtonElement>storybook_element).disabled = false;
      if (this.checkNotMaxScene() && all_correct_bool) {
        storybook_element.innerHTML = 'Next Scene';
        this.user_passed = true;
      }
    }, (error) => {
      console.log(error);
    });
  }


  ngOnDestroy() {
    this.storybookAudioInitializedSubscription.unsubscribe();
    this.storybookSceneCompleteSubscription.unsubscribe();
  }


  setActiveSectionTab(given_index: number) {
    if (this.userService.section === String(given_index)) {
      return 'active';
    } else if (this.userService.section === '' && given_index === 1) {
      return 'active';
    }
    return '';
  }

  setStorybookImage() {
    return '/IMENTOR/img/contents/' + this.userService.ho + '_' + this.userService.section + '.png';
  }

  setStorybookAudio(audio_part: string) {
    if (audio_part !== undefined && audio_part !== '') {
      return '/IMENTOR/mp3/storybook/' + this.userService.ho + '_' + this.userService.section + '_' + audio_part + '.mp3';
    } else {
      return '/IMENTOR/mp3/storybook/' + this.userService.ho + '_' + this.userService.section + '.mp3';
    }
  }

  clickSectionTab(a_section: number) {
    console.log('clickSectionTab: ' + a_section);
    this.userService.section = String(a_section);
    this.questionGenerateService.getQuestionFromServer();
  }

  checkNotMaxScene() {
    console.log('checkNotMaxScene: ' + this.NUM_SECTION_TOTAL + '  ' + this.userService.section);
    return parseInt(this.userService.section, 10) < this.NUM_SECTION_TOTAL;
  }

  finishStorybook() {
      this.viewStateService.view_state = this.viewStateService.IMENTOR_MAIN;
      this.router.navigate(['main']);
  }

  gotoNextScene() {
    if (parseInt(this.userService.section, 10) < this.NUM_SECTION_TOTAL) {
      this.clickSectionTab(parseInt(this.userService.section, 10) + 1);
    } else {
      alert('You can\'t go to the next scene. Please Finish instead.');
    }
    this.disableButtons();
  }

  retryScene() {
    if (this.user_passed) {
      this.gotoNextScene();
      this.user_passed = false;
    } else {
      this.questionGenerateService.getQuestionFromServer();
    }
    this.disableButtons();
  }

  disableButtons() {
    (<HTMLButtonElement>document.getElementById('storybook_finish_button')).disabled = true;
    (<HTMLButtonElement>document.getElementById('storybook_next_button')).disabled = true;
    (<HTMLButtonElement>document.getElementById('storybook_next_button')).innerHTML = 'Retry';
  }


}
