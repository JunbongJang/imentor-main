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
import {environment} from '../../../environments/environment.prod';
import {GeneralUtilityService} from '../../core/general-utility.service';
import * as $ from 'jquery';

@Component({
  selector: 'story-four',
  templateUrl: './story-four.component.html',
  styleUrls: ['./story-four.component.css']
})
export class StoryFourComponent implements OnInit, OnDestroy, AfterViewChecked {

  private wrong_count = 0;
  public current_question_num = 0;
  public total_question_num = 0;
  private nextQuestionCalled = false;

  storyTestForm: FormGroup;
  current_english_sentence = '';
  current_translation_sentence = '';

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
    this.storyTestForm = new FormGroup({
      'english_sentence': new FormControl(null, [Validators.required, this.checkAnswer.bind(this)])
    });

    this.viewStateService.view_state = this.viewStateService.STORYBOOK_FOUR;
    this.userService.step = 'storybook4';
    this.questionGenerateService.getQuestionFromServer();

    this.questionInitializedSubscription = this.questionStorageService.questionInitialized.subscribe(() => {
        this.initialModalService.modalInitialized.next('story-four');
      },
      (error) => {
        console.log(error);
      });

    this.modalStartSubscription = this.initialModalService.modalStartClicked.subscribe(
      (modal_state) => {
        this.storybookService.storybookSceneAudioInitialize.next('');
        this.initializeStorybookFour(); // so that the focus remains.
      }, (error) => {
        console.log('error');
        console.log(error);
      });

    // this.storyTestForm.get('english_sentence').valueChanges.subscribe( text_input => {
    //   this.checkEnglishWord();
    // });

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

  checkAnswer(control: FormControl): { [s: string]: boolean } {
    const english_input = this.generalUtilityService.replaceChineseSpecialCharacters(control.value);
    if (english_input === null || english_input === '') {
      return null;
    } else {
      const current_char_index = english_input.length - 1;
      console.log(current_char_index + ' ' + english_input[current_char_index] + ' ' + this.current_english_sentence[current_char_index]);
      if (english_input[current_char_index] === '\n') {
        if (this.onSubmit() === false) {
          this.storyTestForm.get('english_sentence').setValue(english_input.replace('\n', '').slice(0, current_char_index));
          return {'answerIsWrong': true};
        }
      } else if (english_input[current_char_index] === '*') {
        // ignore this since I, programmer put it. Not the user.
        return {'answerIsWrong': true};
      } else if (this.current_english_sentence[current_char_index] === undefined) { // in case user puts word in between * ex) **dsfdsfds**
        return {'answerIsWrong': true};
      } else if (english_input[current_char_index] !== this.current_english_sentence[current_char_index]) {
        this.storyTestForm.get('english_sentence').setValue(english_input.replace('\n', '').slice(0, current_char_index) + '*');
        return {'answerIsWrong': true};
      } else if (english_input === this.current_english_sentence) {
        console.log('check answer: correct sentence');
        return null;
      } else {
        // typing answer
        return null;
      }
    }
  }

  onSubmit() {
    if (this.generalUtilityService.replaceChineseSpecialCharacters(this.storyTestForm.get('english_sentence').value).trim() === this.current_english_sentence) {
      console.log('onSubmit: correct sentence');
      this.questionSoundService.feedbackAudioClosure.correct();
      this.storybookService.storybookSetBomb.next(0); // reset the bomb!
      this.checkNextQuestion();
      return true;
    } else {
      console.log('onSubmit: wrong sentence');
      this.questionSoundService.feedbackAudioClosure.wrong();
      this.showHint();
      this.wrong_count++;
      this.storybookService.storybookSetBomb.next(this.wrong_count);
      return false;
    }
  }

  checkNextQuestion() {
    this.current_question_num++;
    this.storyTestForm.get('english_sentence').setValue('');

    if (this.current_question_num >= this.total_question_num ) { // solved all the problems when current_question_num is equal to the total - 1
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
      this.setCurrentSentences();
      this.nextQuestionCalled = true; // this will cause ngAfterViewChecked() to call initialProblemSetup() when generateQuestion is over.
    }
  }

  initializeStorybookFour() {
    this.current_question_num = 0;
    this.total_question_num = this.questionStorageService.question_structure.storybook4.length;

    this.storyTestForm.get('english_sentence').setValue('');
    this.setCurrentSentences();
    setTimeout(() => {
      this.initialProblemSetup();
    }, 0);
  }

  setCurrentSentences() {
    // set current english sentence
      this.current_english_sentence = this.questionStorageService.question_structure.storybook4[this.current_question_num].eng;
      // set current translation sentence
      if (environment.chinese) {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook4[this.current_question_num].cn;
      } else {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook4[this.current_question_num].kor;
      }
  }

  initialProblemSetup(): void {
    this.wrong_count = 0;
    this.storybookService.storybookSetBomb.next(0); // reset the bomb!
    let textarea_rows = 1;
    let textarea_cols = this.current_english_sentence.length;
    if (textarea_cols < 1) {
      textarea_cols = 1;
    } else if (textarea_cols > 34) {
      textarea_cols = 33;
      textarea_rows = 2;
    }
    const current_english_input = document.getElementById('english_sentence_' + this.current_question_num);
    current_english_input.style.width = String(textarea_cols) + 'rem';
    (<HTMLTextAreaElement>current_english_input).rows = textarea_rows;
    window.setTimeout(() => {
      current_english_input.focus();
    }, 0);
    document.getElementById('story_four_div_' + this.current_question_num).scrollIntoView(false); // align to top
  }

  /**
   * this has to be in ascending order from 0 ~~ n so that it works well with current_question_number logic.
   * @returns {string[]}
   */
  getKeys() {
    const list: string[] = [];
    for (let i = 0; i < this.total_question_num; i++) {
      list.push(String(i));
    }
    return list;
  }

  displayEnglishSentences(a_key: number) {
      return this.questionStorageService.question_structure.storybook4[a_key].eng;
  }

  displayTranslationSentences(a_key: number) {
    if (environment.chinese) {
        return this.questionStorageService.question_structure.storybook4[a_key].cn;
    } else {
        return this.questionStorageService.question_structure.storybook4[a_key].kor;
    }
  }

  showHint() {
      console.log('show');
      if (this.wrong_count < 3) {
        $('#storyHintModalCenter').modal('show');
      }
      console.log('showed');
  }


}
