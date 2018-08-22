import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class QuestionStorageService {

  dataInitialized = new Subject<boolean>();

  // storybook question has data in order, which means I don't have to shuffle it by implementing Map data structure.
  private _question_structure = {
    storybook1: [{
      eng: '',
      o_word: '',
      x_word: ''
    }],
    storybook2_3: [{
      pgraph: [{
          eng: '',
          kor: '',
          cn: ''
        }
      ]
    }],
    storybook4: [{
      eng: '',
      kor: '',
      cn: ''
    }],
  };


  private _nextQuestionCalled = new Subject<number>();

  private _question_map: Map<string, {seq: string, english: string, english_raw: string, english_parsed: string[], korean: string}>;
  private _current_english_sentence: string;
  private _current_korean_sentence: string;
  private _current_question_number: number;
  private _total_question_number: number;

  constructor() {
    this._question_map = new Map();
  }

  initializeDefaultList() {
    this._question_map = new Map();
    this._question_map.set('3', {seq: '22', english: 'He is not afraid of cats.', english_parsed: [],
      english_raw: 'He [is not] afraid of cats.', korean: '그는 아니다 두려운 고양이들이.'});
    this._question_map.set('0', {seq: '23', english: 'Are they happy?', english_parsed: [],
      english_raw: '[Are] they happy[?]', korean: '이니 그들은 행복한?'});
    this._question_map.set('2', {seq: '24', english: 'Is he happy?', english_parsed: [],
      english_raw: '[Is] he happy[?]', korean: '이니 그는 행복한?'});
    this._question_map.set('1', {seq: '25', english: 'No, they are not happy.', english_parsed: [],
      english_raw: '[No,] they [are not] happy.',  korean: '아니, 그들은 아니다 행복한.'});
    this._question_map.set('4', {seq: '26', english: 'Yes, he is happy.', english_parsed: [],
      english_raw: '[Yes,] he [is] happy.', korean: '그래, 그는 이다 행복한.'});
    this._question_map.set('5', {seq: '27', english: 'What is Tiger doing?', english_parsed: [],
      english_raw: 'What [is] Tiger doing[?]', korean: '무엇을 호랑이는 하는 중이니?'});

    for (let i = 0; i < this._question_map.size; i++) {
      this._question_map.set(String(i), {
        seq: this._question_map.get(String(i)).seq,
        korean: this._question_map.get(String(i)).korean,
        english: this._question_map.get(String(i)).english,
        english_raw: this._question_map.get(String(i)).english_raw,
        english_parsed: this.fromRawToParsed(this._question_map.get(String(i)).english_raw)
      });
    }
    console.log(this._question_map);

    this._current_question_number = 0;
    this._current_english_sentence = this._question_map.get('0').english;
    this._current_korean_sentence = this._question_map.get('0').korean;
    this._total_question_number = this._question_map.size;
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

  get question_structure(): { storybook1: { eng: string; o_word: string; x_word: string }[]; storybook2_3: { pgraph: { eng: string; kor: string; cn: string }[] }[]; storybook4: { eng: string; kor: string; cn: string }[] } {
    return this._question_structure;
  }

  set question_structure(value: { storybook1: { eng: string; o_word: string; x_word: string }[]; storybook2_3: { pgraph: { eng: string; kor: string; cn: string }[] }[]; storybook4: { eng: string; kor: string; cn: string }[] }) {
    this._question_structure = value;
  }
}
