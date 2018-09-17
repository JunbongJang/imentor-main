import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class QuestionStorageService {

  questionInitialized = new Subject<boolean>();

  // storybook question has data in order, which means I don't have to shuffle it by implementing Map data structure.
  private _question_structure = {
    storybook1: [{
      eng: '',
      o_word: '',
      x_word: ''
    }],
    storybook2_3: {
      pgraph1: [{
          eng: '',
          kor: '',
          cn: ''
      }],
      pgraph2: [{
        eng: '',
        kor: '',
        cn: ''
      }]
    },
    storybook4: [{
      eng: '',
      kor: '',
      cn: ''
    }],
    max_section: ''
  };


  private _nextQuestionCalled = new Subject<number>();

  private _question_map: Map<string, {seq: string, english: string, english_raw: string, english_parsed: string[], korean: string}>;
  private _current_english_sentence: string;
  private _current_korean_sentence: string;
  private _current_question_number: number;
  private _total_question_number: number;

  constructor() {
    this.initializeDefaultQuestionStructure();
  }

  initializeDefaultQuestionStructure() {
    this.question_structure.storybook1 = [
      {eng: 'Let\'s go. Let\'s drink water [together].', o_word: 'together', x_word: 'tonight'},
      {eng: 'Let\'s go and eat fruit together.', o_word: '', x_word: ''},
      {eng: 'No. Tiger is very [greedy].', o_word: 'greedy', x_word: 'bad'},
      {eng: 'He is very strong, too.', o_word: '', x_word: ''},
      {eng: 'We are afraid. We are [afraid].', o_word: 'afraid', x_word: 'sad'},
      {eng: 'Tiger is [strong], but he is not smart.', o_word: 'strong', x_word: 'bad'},
      {eng: 'I am not strong, but I am smart. Umm...', o_word: '', x_word: ''},
      {eng: 'Right!', o_word: '', x_word: ''},
      {eng: 'What is Tiger doing?', o_word: '', x_word: ''},
      {eng: 'He is [sleeping]. He is sleeping under the tree.', o_word: 'sleeping', x_word: 'lying'}
    ];

    this.question_structure.storybook2_3.pgraph1 = [
      {eng: 'Let\'s go. Let\'s drink water [together].[@@] Let\'s …ong, [too].[@@] We [are] afraid. We are [afraid].', kor: '가자. 마시자 물을 함께.\\n가자 그리고 먹자 과일을 함께.\\n안 돼. 호랑이는 매우 …쟁이야.\\n그는 이다 매우 강한, 또한.\\n우리는 이다 두려운. 우리는 이다 두려운.', cn: ''}
    ];
    this.question_structure.storybook2_3.pgraph2 = [
      {eng: 'Tiger is strong, [but] he is [not] [smart].[@@] I … [sleeping]. He is sleeping [under] [the] [tree].', kor: '호랑이는 이다 강한, 그러나 그는 아니다 영리한.\\n나는 아니다 강한, 그러나 나는 이다…을 호랑이는 하고 있는 중이니?\\n그는 자는 중이다. 그는 자는 중이다 나무 아래에서.', cn: ''}
    ];

    this.question_structure.storybook4 = [
      {eng: 'Let\'s go.', kor: '가자.', cn: ''},
      {eng: 'Let\'s drink water together.', kor: '마시자 물을 함께.', cn: ''},
      {eng: 'Let\'s go and eat fruit together.', kor: '가자 그리고 먹자 과일을 함께.', cn: ''},
      {eng: 'No. Tiger is very greedy.', kor: '안 돼. 호랑이는 매우 욕심쟁이야.', cn: ''},
      {eng: 'He is very strong, too.', kor: '그는 이다 매우 강한, 또한.', cn: ''},
      {eng: 'We are afraid.', kor: '우리는 이다 두려운.', cn: ''},
      {eng: 'We are afraid.', kor: '우리는 이다 두려운.', cn: ''},
      {eng: 'Tiger is strong, but he is not smart.', kor: '호랑이는 이다 강한, 그러나 그는 아니다 영리한.', cn: ''},
      {eng: 'I am not strong, but I am smart. Umm...', kor: '나는 아니다 강한, 그러나 나는 이다 영리한. 음…', cn: ''},
      {eng: 'Right!', kor: '맞아!', cn: ''},
      {eng: 'What is Tiger doing?', kor: '무엇을 호랑이는 하고 있는 중이니?', cn: ''},
      {eng: 'He is sleeping.', kor: '그는 자는 중이다.', cn: ''},
      {eng: 'He is sleeping under the tree.', kor: '그는 자는 중이다 나무 아래에서.', cn: ''}
  ];

    // this._current_question_number = 0;
    // this._current_english_sentence = this._question_map.get('0').english;
    // this._current_korean_sentence = this._question_map.get('0').korean;
    // this._total_question_number = this._question_map.size;
  }

  gotoNextQuestion(): number {
    this._current_question_number++;
    this._current_english_sentence = this._question_map.get(String(this._current_question_number)).english;
    this._current_korean_sentence = this._question_map.get(String(this._current_question_number)).korean;
    this._nextQuestionCalled.next(this._current_question_number);
    return this._current_question_number;
  }

  resetQuestionNumber() {
    this._current_question_number = 0;
    this._current_english_sentence = this._question_map.get(String(this._current_question_number)).english;
    this._current_korean_sentence = this._question_map.get(String(this._current_question_number)).korean;
    console.log('question reset');
  }

  /**
   * Search inside the given string for the character pattern [~~~~~]
   * @param {string} a_string
   * @returns {string[]}
   */
  fromRawToParsed(a_string: string): string[] {
    // a_string = 'sdf [der] fsdf sdfdsf [?] hel[SADSD]lo [do\'t] [!]sdf [df.,df.:]';
    // console.log('fromRawToQuestion: ' + a_string);
    const regex_expr = /\[(\w|\!|\?|\'|\.|\:|\,| )*\]/g;
    const matched_array: RegExpMatchArray = a_string.match(regex_expr);
    const phrase_array: string[] = [];

    for (let a_element of matched_array) {
      a_element = a_element.replace('[', '');
      a_element = a_element.replace(']', '');
      phrase_array.push(a_element);
    }
    // console.log(phrase_array);
    return phrase_array;
  }


  get nextQuestionCalled(): Subject<number> {
    return this._nextQuestionCalled;
  }

  get question_map(): Map<string, { seq: string; english: string; english_raw: string; english_parsed: string[]; korean: string }> {
    return this._question_map;
  }

  set question_map(value: Map<string, { seq: string; english: string; english_raw: string; english_parsed: string[]; korean: string }>) {
    this._question_map = value;
  }

  get current_english_sentence(): string {
    return this._current_english_sentence;
  }

  get current_korean_sentence(): string {
    return this._current_korean_sentence;
  }

  get current_question_number(): number {
    return this._current_question_number;
  }

  get total_question_number(): number {
    return this._total_question_number;
  }

  set total_question_number(value: number) {
    this._total_question_number = value;
  }

  get question_structure(): { storybook1: { eng: string; o_word: string; x_word: string }[]; storybook2_3: { pgraph1: { eng: string; kor: string; cn: string }[]; pgraph2: { eng: string; kor: string; cn: string }[] }; storybook4: { eng: string; kor: string; cn: string }[]; max_section: string } {
    return this._question_structure;
  }

  set question_structure(value: { storybook1: { eng: string; o_word: string; x_word: string }[]; storybook2_3: { pgraph1: { eng: string; kor: string; cn: string }[]; pgraph2: { eng: string; kor: string; cn: string }[] }; storybook4: { eng: string; kor: string; cn: string }[]; max_section: string }) {
    this._question_structure = value;
  }
}
