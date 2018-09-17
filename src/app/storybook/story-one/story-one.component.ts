import {Component, OnDestroy, OnInit} from '@angular/core';
import {ViewStateService} from '../../core/view-state.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {QuestionGenerateService} from '../question/question-generate.service';
import {QuestionStorageService} from '../question/question-storage.service';
import {QuestionSoundService} from '../question/question-sound.service';
import {StorybookService} from '../storybook.service';
import {Subscription} from 'rxjs';
import {InitialModalService} from '../initial-modal/initial-modal.service';

@Component({
  selector: 'story-one',
  templateUrl: './story-one.component.html',
  styleUrls: ['./story-one.component.css']
})
export class StoryOneComponent implements OnInit, OnDestroy  {

  pair_words: {
    first_word: string,
    second_word: string,
    correct: string
  }[] = [];

  split_sentences: {
    split: boolean,
    left_phrase: string,
    right_phrase: string
  }[] = [];

  row_index_array: number[] = [];
  correct_num = 0;
  current_question_num = 0;

  questionInitializedSubscription: Subscription;
  storybookSceneChangeSubscription: Subscription;
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
    this.viewStateService.view_state = this.viewStateService.STORYBOOK_ONE;
    this.userService.step = 'storybook1';

    this.questionGenerateService.getQuestionFromServer(this.userService.step);

    this.storybookSceneChangeSubscription = this.storybookService.storybookSceneChange.subscribe(() => {
        this.questionGenerateService.getQuestionFromServer(this.userService.step);
      },
      (error) => {
        console.log(error);
      });

    this.questionInitializedSubscription = this.questionStorageService.questionInitialized.subscribe(() => {
        console.log('question Initialized');
        this.initializeStorybookOne();
        this.storybookService.storybookAudioInitialize.next('');
        this.initialModalService.modalInitialized.next('voca-one');
      },
      (error) => {
        console.log(error);
      });

    this.modalStartSubscription = this.initialModalService.modalStartClicked.subscribe(
      (modal_state) => {
      }, (error) => {
        console.log('error');
        console.log(error);
      });
  }

  ngOnDestroy() {
    this.questionInitializedSubscription.unsubscribe();
    this.storybookSceneChangeSubscription.unsubscribe();
    this.modalStartSubscription.unsubscribe();
  }

  initializeStorybookOne() {
    this.correct_num = 0;
    this.current_question_num = 0;

    this.initializeSentences();
    this.initializePairWords();
    setTimeout(() => {this.initializeNumberForPairs(); }, 0);
  }

  initializeSentences() {
    this.split_sentences = [];
    this.row_index_array = [];

    for (let i = 0; i < this.questionStorageService.question_structure.storybook1.length; i++) {
      if (this.questionStorageService.question_structure.storybook1[i].eng.match(/\[\w*\]/)) {
        const answer_length = this.questionStorageService.question_structure.storybook1[i].eng.match(/\[\w*\]/)[0].length;
        const question_start_index = this.questionStorageService.question_structure.storybook1[i].eng.search(/\[\w*\]/);
        const question_end_index = this.questionStorageService.question_structure.storybook1[i].eng.search(/\[\w*\]/) + answer_length;
        this.split_sentences.push({
          split: true,
          left_phrase: this.questionStorageService.question_structure.storybook1[i].eng.substring(0, question_start_index),
          right_phrase: this.questionStorageService.question_structure.storybook1[i].eng.substring(question_end_index, this.questionStorageService.question_structure.storybook1[i].eng.length)
        });
        this.row_index_array.push(i);
      } else {
        this.split_sentences.push({
          split: false,
          left_phrase: this.questionStorageService.question_structure.storybook1[i].eng,
          right_phrase: ''
        });
      }
    }
    console.log('initializeSentences');
    console.log(this.split_sentences);
  }

  initializePairWords() {
    this.pair_words = [];

    for (let i = 0; i < this.row_index_array.length; i++) {
      const pair_word = {
        first_word: '',
        second_word: '',
        correct: ''
      };
      const question_index = this.row_index_array[i];
      if (Math.random() >= 0.5) {
        pair_word.first_word = this.questionStorageService.question_structure.storybook1[question_index].o_word;
        pair_word.second_word = this.questionStorageService.question_structure.storybook1[question_index].x_word;
        pair_word.correct = 'first';
      } else {
        pair_word.second_word = this.questionStorageService.question_structure.storybook1[question_index].o_word;
        pair_word.first_word = this.questionStorageService.question_structure.storybook1[question_index].x_word;
        pair_word.correct = 'second';
      }
      this.pair_words[question_index] = pair_word;
    }
    console.log('initializePairs');
    console.log(this.pair_words);
  }

  initializeNumberForPairs() {
    console.log('initializeNumberForPairs');
    console.log(this.row_index_array);
    for (let i = 0; i < this.row_index_array.length; i++) {
      document.getElementById('storybook_pair_' + this.row_index_array[i]).innerHTML = '&#93' + (i + 12) + ';';
    }
  }

  pairWordClick(pair_order: string, idx: number) {
    const clicked_question_num = this.findQuestionNumberFromRowIndexArray(idx);
    console.log('clickedQuestionNum: ' + clicked_question_num);

    if (this.current_question_num === clicked_question_num) {
      console.log('pairWordClick');
      console.log(pair_order + '  ' + idx);
      if (pair_order === this.pair_words[idx].correct) {
        this.correct_num++;
        // this.questionSoundService.feedbackAudioClosure.correct();
        document.getElementById('storybook_pair_' + idx).style.color = 'green';
      } else {
        document.getElementById('storybook_pair_' + idx).classList.add('strikethrough');
        document.getElementById('storybook_pair_' + idx).style.color = 'red';
        // this.questionSoundService.feedbackAudioClosure.wrong();
      }

      if (this.pair_words[idx].correct === 'first') {
        document.getElementById('pair_first_word_' + idx).style.color = 'green';
        document.getElementById('pair_second_word_' + idx).classList.add('strikethrough');
      } else {
        document.getElementById('pair_second_word_' + idx).style.color = 'green';
        document.getElementById('pair_first_word_' + idx).classList.add('strikethrough');
      }
      this.current_question_num++;
    } else {
      alert ('please do previous question first');
    }

    this.checkNextQuestion();
  }

  checkNextQuestion() {
    if (this.row_index_array.length <= this.current_question_num) {
      if (this.correct_num >= this.row_index_array.length) {
        this.storybookService.storybookSceneComplete.next(true);
      } else {
        alert('you failed the current storybook scene.\nPlease try again.');
        this.initializeStorybookOne();
        this.storybookService.storybookAudioInitialize.next('');
      }
    }
  }

  findQuestionNumberFromRowIndexArray(idx: number) {
    for (let i = 0; i < this.row_index_array.length; i++) {
      if (idx === this.row_index_array[i]) {
        return i;
      }
    }

    return 0;
  }

  calculateScore() {
    return this.correct_num / this.row_index_array.length;
  }

}
