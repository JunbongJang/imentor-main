import {AfterViewChecked, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';
import {Subscription} from 'rxjs';
import {QuestionStorageService} from '../question/question-storage.service';
import {QuestionSoundService} from '../question/question-sound.service';
import {InitialModalService} from '../initial-modal/initial-modal.service';
import {StorybookService} from '../storybook.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment.prod';
import {GeneralUtilityService} from '../../core/general-utility.service';

@Component({
  selector: 'story-two',
  templateUrl: './story-two.component.html',
  styleUrls: ['./story-two.component.css']
})
export class StoryTwoComponent implements OnInit, OnDestroy, AfterViewChecked {

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
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_TWO;
    this.userService.step = 'storybook2';

    this.questionGenerateService.getQuestionFromServer();

    this.questionInitializedSubscription = this.questionStorageService.questionInitialized.subscribe(() => {
        this.initialModalService.modalInitialized.next('story-two');
      },
      (error) => {
        console.log(error);
      });

    this.modalStartSubscription = this.initialModalService.modalStartClicked.subscribe(
      (modal_state) => {
        this.storybookService.storybookSceneAudioInitialize.next('1');
        this.initializeStorybookTwo(); // so that the focus remains.
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

  checkAnswer(control: FormControl): {[s: string]: boolean} {
    const english_input = control.value;
    if (english_input === null || english_input === '') {
      return null;
    } else {
      const current_char_index = english_input.length - 1;
      if (english_input[current_char_index] === '*') {
        // ignore this since I, programmer put it. Not the user.
        return {'answerIsWrong': true};
      } else if (english_input[current_char_index] !== this.current_english_sentence[current_char_index]) {
        this.storyTestForm.get('english_sentence').setValue(english_input.slice(0, current_char_index) + '*');
        this.questionSoundService.feedbackAudioClosure.wrong();
        return {'answerIsWrong': true};
      } else if (english_input === this.current_english_sentence) {
        console.log('correct sentence!!!');
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
        this.storybookService.storybookSceneAudioInitialize.next('2');
      }
      this.storyTestForm.get('english_sentence').setValue('');
      this.setCurrentSentences();
      this.nextQuestionCalled = true; // this will cause ngAfterViewChecked() to call initialProblemSetup() when generateQuestion is over.
    }
  }

  initializeStorybookTwo() {
    this.current_question_num = 0;
    this.total_question_num = this.questionStorageService.question_structure.storybook2_3.pgraph1.length + this.questionStorageService.question_structure.storybook2_3.pgraph2.length;

    this.storyTestForm.get('english_sentence').setValue('');
    this.setCurrentSentences();
    setTimeout(() => {
        this.initialProblemSetup();
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('pb-4');
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('border_thick');
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('mb-3');
      }, 0);
  }

  setCurrentSentences() {
    // set current english sentence
    if (this.current_question_num < this.questionStorageService.question_structure.storybook2_3.pgraph1.length) {
      this.current_english_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph1[this.current_question_num].eng;
      // set current translation sentence
      if (environment.chinese) {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph1[this.current_question_num].cn;
      } else {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph1[this.current_question_num].kor;
      }

    } else {
      const pgraph2_index = this.current_question_num - this.questionStorageService.question_structure.storybook2_3.pgraph1.length;
      this.current_english_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[pgraph2_index].eng;
      // set current translation sentence
      if (environment.chinese) {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[pgraph2_index].cn;
      } else {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[pgraph2_index].kor;
      }
    }
  }

  initialProblemSetup(): void {
    console.log('initialProblemSetupt: ' + this.current_question_num + '  ' + this.current_english_sentence);
    let input_size = this.current_english_sentence.length;
    if (input_size < 1) {
      input_size = 1;
    } else if (input_size > 34) {
      input_size = 34;
    }
    const current_english_input = document.getElementById('english_sentence_' + this.current_question_num);
    current_english_input.style.width = String(input_size) + 'rem';
    window.setTimeout(() => {current_english_input.focus(); }, 0);
    document.getElementById('story_two_div_' + this.current_question_num).scrollIntoView(false); // align to top
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
    if (a_key < this.questionStorageService.question_structure.storybook2_3.pgraph1.length) { // pgraph1
      return this.questionStorageService.question_structure.storybook2_3.pgraph1[a_key].eng;
    } else { // pgraph2
      if (this.generalUtilityService.checkEmptyArray(this.questionStorageService.question_structure.storybook2_3.pgraph2)) {
        return '';
      } else {
        return this.questionStorageService.question_structure.storybook2_3.pgraph2[a_key - this.questionStorageService.question_structure.storybook2_3.pgraph1.length].eng;
      }
    }
  }

  displayTranslationSentences(a_key: number) {
    if (environment.chinese) {
      if (a_key < this.questionStorageService.question_structure.storybook2_3.pgraph1.length) { // pgraph1
        return this.questionStorageService.question_structure.storybook2_3.pgraph1[a_key].cn;
      } else { // pgraph2
        if (this.generalUtilityService.checkEmptyArray(this.questionStorageService.question_structure.storybook2_3.pgraph2)) {
          return '';
        } else {
          return this.questionStorageService.question_structure.storybook2_3.pgraph2[a_key - this.questionStorageService.question_structure.storybook2_3.pgraph1.length].cn;
        }
      }

    } else {
      if (a_key < this.questionStorageService.question_structure.storybook2_3.pgraph1.length) { // pgraph1
        return this.questionStorageService.question_structure.storybook2_3.pgraph1[a_key].kor;
      } else {   // pgraph2
        if (this.generalUtilityService.checkEmptyArray(this.questionStorageService.question_structure.storybook2_3.pgraph2)) {
          return '';
        } else {
          return this.questionStorageService.question_structure.storybook2_3.pgraph2[a_key - this.questionStorageService.question_structure.storybook2_3.pgraph1.length].kor;
        }
      }
    }

  }



}
