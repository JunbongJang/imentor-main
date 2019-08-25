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
  public input_foucsed = false;

  storyTestForm: FormGroup;
  current_english_sentence = '';
  private current_pgraph_num = 0;

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
    const english_input = this.generalUtilityService.replaceChineseSpecialCharacters(control.value);
    if (english_input === null || english_input === '') {
      return null;
    } else {
      const current_char_index = english_input.length - 1;
      if (english_input[current_char_index] === '*') {
        // ignore this since I, programmer put it. Not the user.
        return {'answerIsWrong': true};
      } else if (this.current_english_sentence[current_char_index] === undefined) { // in case user puts word in between * ex) **dsfdsfds**
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
      if (this.current_question_num === this.addPrevParaNums(this.current_pgraph_num)) {
        this.current_pgraph_num = this.current_pgraph_num + 1;
        this.storybookService.storybookSceneAudioInitialize.next((this.current_pgraph_num).toString());
      }
      this.storyTestForm.get('english_sentence').setValue('');
      this.setCurrentEnglishSentence();
      this.nextQuestionCalled = true; // this will cause ngAfterViewChecked() to call initialProblemSetup() when generateQuestion is over.
    }
  }

  initializeStorybookTwo() {
    this.current_question_num = 0;
    this.current_pgraph_num = 0;
    this.total_question_num = 0;
    for ( let i = 0; i < this.questionStorageService.question_structure.storybook2_3.length; i++) {
      this.total_question_num += this.questionStorageService.question_structure.storybook2_3[i].length;
    }
    this.storyTestForm.get('english_sentence').setValue('');
    this.setCurrentEnglishSentence();
    setTimeout(() => {
        this.initialProblemSetup();
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('pb-4');
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('border_thick');
        // document.getElementById('story_two_div_' + (this.questionStorageService.question_structure.storybook2_3.pgraph1.length - 1)).classList.add('mb-3');
      }, 0);
  }

  initialProblemSetup(): void {
    // console.log('initialProblemSetupt: ' + this.current_question_num + '  ' + this.current_english_sentence);
    let textarea_rows = 1;
    let textarea_cols = this.current_english_sentence.length;
    if (textarea_cols < 5) {
      textarea_cols = 5;
    } else if (textarea_cols > 34) {
      textarea_cols = 33;
      textarea_rows = 2;
    }
    const current_english_input = document.getElementById('english_sentence_' + this.current_question_num);
    current_english_input.style.width = String(textarea_cols) + 'rem';
    (<HTMLTextAreaElement>current_english_input).rows = textarea_rows;
    window.setTimeout(() => {current_english_input.focus(); }, 0);
    document.getElementById('story_two_div_' + this.current_question_num).scrollIntoView(false); // align to bottom
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

  setCurrentEnglishSentence() {
    this.current_english_sentence = this.displayEnglishSentences(this.current_question_num);
  }

  displayEnglishSentences(a_key: number) {
    const max_pgraph_num = this.questionStorageService.question_structure.storybook2_3.length;
    let a_pgraph_num = 0;
    for (let i = 0; i < max_pgraph_num; i++) {
      if (a_key - this.addPrevParaNums(i) >= 0) {
        a_pgraph_num = i;
      }
    }

    return this.questionStorageService.question_structure.storybook2_3[a_pgraph_num][a_key - this.addPrevParaNums(a_pgraph_num)].eng;
  }

  displayTranslationSentences(a_key: number) {
    const max_pgraph_num = this.questionStorageService.question_structure.storybook2_3.length;
    let a_pgraph_num = 0;
    for (let i = 0; i < max_pgraph_num; i++) {
      if (a_key - this.addPrevParaNums(i) >= 0) {
        a_pgraph_num = i;
      }
    }

    if (environment.chinese) {
      return this.questionStorageService.question_structure.storybook2_3[a_pgraph_num][a_key - this.addPrevParaNums(a_pgraph_num)].cn;
    } else {
      return this.questionStorageService.question_structure.storybook2_3[a_pgraph_num][a_key - this.addPrevParaNums(a_pgraph_num)].kor;
    }
  }

  private addPrevParaNums(current_pgraph_num: number) {
    let total_prev_nums = 0;
    for (let i = 0; i < current_pgraph_num; i++) {
      if (i < this.questionStorageService.question_structure.storybook2_3.length) {
        total_prev_nums += this.questionStorageService.question_structure.storybook2_3[i].length;
      }
    }
    return total_prev_nums;
  }


}
