import {AfterViewChecked, Component, OnDestroy, OnInit} from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {StorybookService} from '../storybook.service';
import {QuestionStorageService} from '../question/question-storage.service';
import {QuestionSoundService} from '../question/question-sound.service';
import {InitialModalService} from '../initial-modal/initial-modal.service';
import {GeneralUtilityService} from '../../core/general-utility.service';

@Component({
  selector: 'story-three',
  templateUrl: './story-three.component.html',
  styleUrls: ['./story-three.component.css']
})
export class StoryThreeComponent implements OnInit, OnDestroy, AfterViewChecked {

  public current_question_num = 0;
  public total_question_num = 0;
  current_pgraph_num = 0; // 0 or 1
  paragraph_list = [];
  private nextQuestionCalled = false;

  storyTestForm: FormGroup;
  current_english_word = '';
  pgraph_english_words = [[], []];

  questionInitializedSubscription: Subscription;
  modalStartSubscription: Subscription;

  constructor(private viewStateService: ViewStateService,
              private serverService: ServerService,
              private userService: UserService,
              private storybookService: StorybookService,
              public questionStorageService: QuestionStorageService,
              private questionGenerateService: QuestionGenerateService,
              private questionSoundService: QuestionSoundService,
              private initialModalService: InitialModalService,
              private generalUtilityService: GeneralUtilityService) {
  }

  ngOnInit() {
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_THREE;
    this.userService.step = 'storybook3';
    this.questionGenerateService.getQuestionFromServer();

    this.storyTestForm = new FormGroup({
      'english_word': new FormControl(null, [Validators.required, this.checkAnswer.bind(this)])
    });

    this.questionInitializedSubscription = this.questionStorageService.questionInitialized.subscribe(() => {
        this.initialModalService.modalInitialized.next('story-two');
      },
      (error) => {
        console.log(error);
      });

    this.modalStartSubscription = this.initialModalService.modalStartClicked.subscribe(
      (modal_state) => {
        this.storybookService.storybookAudioInitialize.next('1');
        this.initializeStorybookThree(); // so that the focus remains.
      }, (error) => {
        console.log('error');
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.questionInitializedSubscription.unsubscribe();
    this.modalStartSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    // console.log('---------ngAfterViewChekced------------');
    if (this.nextQuestionCalled === true) {
      this.nextQuestionCalled = false;
      this.initialProblemSetup();
    }
  }

  checkAnswer(control: FormControl): {[s: string]: boolean} {
    const english_input = control.value;
    if (english_input === null || english_input === '') {
      return null;
    } else {
      const current_char_index = english_input.length - 1;
      if (english_input[current_char_index] === '*') {
        // ignore this since I, programmer put it. Not the user.
        return {'answerIsWrong': true};
      } else if (english_input[current_char_index] !== this.current_english_word[current_char_index]) {
        this.storyTestForm.get('english_word').setValue(english_input.slice(0, current_char_index) + '*');
        this.questionSoundService.feedbackAudioClosure.wrong();
        return {'answerIsWrong': true};
      } else if (english_input === this.current_english_word) {
        console.log('correct word!!!');
        this.questionSoundService.feedbackAudioClosure.correct();
        this.current_question_num++;
        this.checkNextQuestion();
        return null;
      } else {
        // typing answer
        return null;
      }
    }
  }

  checkNextQuestion() {
    if (this.current_question_num >= this.total_question_num) { // solved all the problems
      this.serverService.postUserScoreToServer('storybook',
        '0',
        '100',
        '1',
        this.userService.user.uid,
        this.userService.user.user_id,
        this.userService.ho,
        this.userService.step,
        this.userService.section).subscribe(
        (post_reply) => {
          console.log('postUserScoreToServer: ' + post_reply);
          this.storybookService.storybookSceneComplete.next(true);
        }, (error) => {
          console.log('error');
          console.log(error);
        });
    } else { // not over yet!
      if (this.current_question_num === this.questionStorageService.question_structure.storybook2_3.pgraph1.length) {
        this.storybookService.storybookAudioInitialize.next('2');
      }
      this.storyTestForm.get('english_word').setValue('');
      this.nextQuestionCalled = true; // this will cause ngAfterViewChecked() to call initialProblemSetup() when generateQuestion is over.
    }
  }

  initializeStorybookThree() {
    this.current_question_num = 0;
    this.pgraph_english_words[0] = this.questionStorageService.question_structure.storybook2_3.pgraph1[0].eng.split('. ');
    if (this.generalUtilityService.checkEmptyArray(this.questionStorageService.question_structure.storybook2_3.pgraph2)) {
      this.pgraph_english_words[1] = [];
      this.paragraph_list = [1];
    } else {
      this.pgraph_english_words[1] = this.questionStorageService.question_structure.storybook2_3.pgraph2[0].eng.split('. ');
      this.paragraph_list = [1, 2];
    }
    this.total_question_num = this.pgraph_english_words[0].length + this.pgraph_english_words[1].length;

    this.storyTestForm.get('english_word').setValue('');
    setTimeout(() => { this.initialProblemSetup(); }, 0);
  }

  initialProblemSetup(): void {
    console.log('initialProblemSetupt: ' + this.current_question_num + '  ' + this.current_english_word);
    let input_size = this.current_english_word.length;
    if (input_size < 1) {
      input_size = 1;
    } else if (input_size > 34) {
      input_size = 34;
    }
    const current_english_input = document.getElementById('english_word_' + this.current_question_num);
    current_english_input.style.width = String(input_size) + 'rem';
    window.setTimeout(() => {current_english_input.focus(); }, 0);
    (<HTMLElement>document.getElementById('story_three_pgraph_' + this.current_question_num)).scrollIntoView(true); // align to top
  }
}
