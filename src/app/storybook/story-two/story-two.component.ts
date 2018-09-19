import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
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

@Component({
  selector: 'story-two',
  templateUrl: './story-two.component.html',
  styleUrls: ['./story-two.component.css']
})
export class StoryTwoComponent implements OnInit, OnDestroy {

  private correct_num = 0;
  public current_question_num = 0;
  public total_question_num = 0;
  private nextQuestionCalled = false;
  input_touched = false;
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
              private initialModalService: InitialModalService) {
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
        this.initializeStorybookTwo();
        this.storybookService.storybookAudioInitialize.next('');
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

  initializeStorybookTwo() {
    this.correct_num = 0;
    this.current_question_num = 0;
    this.total_question_num = this.questionStorageService.question_structure.storybook2_3.pgraph1.length + this.questionStorageService.question_structure.storybook2_3.pgraph2.length;
    this.initialProblemSetup();
  }

  checkNextQuestion() {
    if (this.current_question_num >= this.total_question_num) {
      if (this.correct_num >= this.total_question_num) { // all questions correct
        this.storybookService.storybookSceneComplete.next(true);
      } else {  // not all questions are correct
        this.storybookService.storybookSceneComplete.next(false);
      }
    }
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
      this.current_english_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[this.current_question_num].eng;
      // set current translation sentence
      if (environment.chinese) {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[this.current_question_num].cn;
      } else {
        this.current_translation_sentence = this.questionStorageService.question_structure.storybook2_3.pgraph2[this.current_question_num].kor;
      }
    }
  }

  initialProblemSetup(): void {
    this.setCurrentSentences();
    let input_size = this.current_english_sentence.length;
    if (input_size < 1) {
      input_size = 1;
    } else if (input_size > 60) {
      input_size = 60;
    }
    const current_english_input = document.getElementById('english_sentence_' + this.current_question_num);
    current_english_input.style.width = String(input_size) + 'rem';
    window.setTimeout(() => {current_english_input.focus(); }, 0);
    (<HTMLElement>document.getElementById('story_test_div_' + this.current_question_num)).scrollIntoView(true); // align to top
  }

  /**
   * this has to be in ascending order from 0 ~~ n so that it works well with current_question_number logic.
   * @returns {string[]}
   */
  getKeys() {
    const list: string[] = [];
    for (let i = 0; i < this.questionStorageService.question_structure.storybook2_3.pgraph1.length; i++) {
      list.push(String(i));
    }
    return list;
  }

  checkAnswer(control: FormControl): {[s: string]: boolean} {
    if (control.value === null) {
      return null;
    } else {
      const english_input = this.storyTestForm.get('english_sentence').value;
      const current_char_index = english_input.length - 1;
      if (english_input[current_char_index] !== this.current_english_sentence[current_char_index]) {
        console.log('wrong char!!!');
        // this.storyTestForm.get('english_sentence').setValue(english_input.slice(0, current_char_index) + '*');
        this.questionSoundService.feedbackAudioClosure.wrong();
        return {'answerIsWrong': true};
      } else if (english_input === this.current_english_sentence) {
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


  // generateQuestion(): void {
  //   const current_english_array: string[] = this.questionStorageService.current_english_sentence.split(' ');
  //   this.current_english_map = new Map();
  //   this.current_index_array = [];
  //
  //   for (let i = 0; i < current_english_array.length; i++) {
  //     this.current_index_array.push(i);
  //     this.current_english_map.set(i, {word: current_english_array[i], passed: false});
  //   }
  //   this.generalUtilityService.shuffleArray(this.current_index_array);
  // }
  //


}
