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
  public current_pgraph_num = 0; // 0 or 1
  public pgraph_list = [];

  public split_sentences: Array<{
    answer: string,
    left_phrase: string,
    right_phrase: string
  }[]> = [[], []];
  public question_english_array = [];
  public question_index_array = [];

  private nextQuestionCalled = false;
  public storyTestForm: FormGroup;
  private questionInitializedSubscription: Subscription;
  private modalStartSubscription: Subscription;

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
        this.storybookService.storybookSceneAudioInitialize.next('1');
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
    const english_input = this.generalUtilityService.replaceChineseSpecialCharacters(control.value);
    if (english_input === null || english_input === '') {
      return null;
    } else {
      const current_char_index = english_input.length - 1;
      if (english_input[current_char_index] === '*') {
        // ignore this since I, programmer put it. Not the user.
        return {'answerIsWrong': true};
      } else if (english_input[current_char_index] !== this.question_english_array[this.current_question_num][current_char_index]) {
        this.storyTestForm.get('english_word').setValue(english_input.slice(0, current_char_index) + '*');
        this.questionSoundService.feedbackAudioClosure.wrong();
        return {'answerIsWrong': true};
      } else if (english_input === this.question_english_array[this.current_question_num]) {
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
    this.storyTestForm.get('english_word').setValue(''); //  always clean after yourself! since going to another scene is also affected by it
    if (this.current_question_num >= this.question_english_array.length) { // solved all the problems
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
      if (this.question_index_array[this.current_question_num] >= this.questionStorageService.question_structure.storybook2_3.pgraph1.length &&
        this.current_pgraph_num === 0) {
        this.current_pgraph_num = 1;
        this.storybookService.storybookSceneAudioInitialize.next('2');
      }
      this.nextQuestionCalled = true; // this will cause ngAfterViewChecked() to call initialProblemSetup() when generateQuestion is over.
    }
  }

  initializeStorybookThree() {
    this.current_question_num = 0;
    this.current_pgraph_num = 0;
    if (this.generalUtilityService.checkEmptyArray(this.questionStorageService.question_structure.storybook2_3.pgraph2)) {
      this.pgraph_list = [1];
    } else {
      this.pgraph_list = [1, 2];
    }

    this.initializeSentences();
    setTimeout(() => {
      this.storyTestForm.get('english_word').setValue('');
      this.initializeNumberForPairs();
      this.initialProblemSetup();
    }, 0);
  }

  initializeSentences() {
    this.split_sentences = [[], []];
    this.question_index_array = [];
    this.question_english_array = [];
    let current_row_index = 0;
    for (let a_pgraph = 0; a_pgraph < this.pgraph_list.length; a_pgraph++) {
      let current_pgrah;
      if (a_pgraph === 0) {
        current_pgrah = this.questionStorageService.question_structure.storybook2_3.pgraph1;
      } else {
        current_pgrah = this.questionStorageService.question_structure.storybook2_3.pgraph2;
      }
      for (let i = 0; i < current_pgrah.length; i++) {
        if (current_pgrah[i].eng.match(/\[\w*\]/)) { // found a question
          const answer = current_pgrah[i].eng.match(/\[\w*\]/)[0];
          const question_start_index = current_pgrah[i].eng.search(/\[\w*\]/);
          const question_end_index = current_pgrah[i].eng.search(/\[\w*\]/) + answer.length;
          this.split_sentences[a_pgraph].push({
            answer: answer.replace('[', '').replace(']', ''),
            left_phrase: current_pgrah[i].eng.substring(0, question_start_index),
            right_phrase: current_pgrah[i].eng.substring(question_end_index, current_pgrah[i].eng.length)
          });
          this.question_index_array.push(current_row_index);
          this.question_english_array.push(answer.replace('[', '').replace(']', ''));
        } else { // just a sentence without question
          this.split_sentences[a_pgraph].push({
            answer: '',
            left_phrase: current_pgrah[i].eng,
            right_phrase: ''
          });
        }
        current_row_index++;
      }
    }
  }

  initializeNumberForPairs() {
    // console.log('initializeNumberForPairs');
    // console.log(this.question_english_array);
    // console.log(this.question_index_array);
    for (let i = 0; i < this.question_index_array.length; i++) {
      document.getElementById('story_three_num_' + i).innerHTML = '&#93' + (i + 12) + ';';
    }
  }

  initialProblemSetup(): void {
    // console.log('initialProblemSetupt: ' + this.current_question_num + '  ' + this.question_english_array[this.current_question_num]);
    let input_size = this.question_english_array[this.current_question_num].length;
    if (input_size < 1) {
      input_size = 1;
    } else if (input_size > 33) {
      input_size = 33;
    }
    const current_english_input = document.getElementById('english_word_' + this.current_question_num);
    current_english_input.style.width = String(input_size) + 'rem';
    window.setTimeout(() => {current_english_input.focus(); }, 0);
    (<HTMLElement>document.getElementById('story_three_pgraph_' + this.current_pgraph_num)).scrollIntoView(true); // align to top
  }

  // because there are two paragraphs!!!
  indexConverter(index: number, pgraph_num: number) {
    if (pgraph_num > 0) {
      return index + this.questionStorageService.question_structure.storybook2_3.pgraph1.length;
    } else {
      return index;
    }
  }

}
