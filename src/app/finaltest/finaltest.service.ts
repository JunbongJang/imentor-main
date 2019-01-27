import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinaltestService {

  private _current_question_index = 0;
  nextQuestionCalled = new Subject<boolean>();
  prepDoneCalled = new Subject<boolean>();
  questionInitialized = new Subject<boolean>();

  questionObject = [{
    dab: 'Tiger is strong, but he is not smart. *[@@][@@]* 난이도 안내',
    ex_img: 'w1_1_120522.jpg',
    ex_mp3: 'w1_1.mp3',
    ex_txt: 'Rabbit is not strong, but he is smart. [@@]___________,but______________________',
    kind: 'writing',
    mark3: null,
    opt_length: '1',
    opt_length2: '2',
    opt_time: '10',
    opt_time2: '120',
    quest: 'Based on the given example, write a sentence describing the picture.',
    quest_kor: '주어진 예를 활용하여, 그림을 묘사하는 문장을 적으세요.',
    seq: '5',
    sub_kind: '1',
    sub_kind_kor: '예시 보고 문장 단위의 글쓰기'
  }];
  answer_list = ['', '', '', ''];

  constructor() { }

  get current_question_index(): number {
    return this._current_question_index;
  }

  set current_question_index(value: number) {
    this._current_question_index = value;
  }

  getCurrentQuestion(kind: string): {
    dab: string;
    ex_img: string;
    ex_mp3: string;
    ex_txt: string | null;
    kind: string;
    mark3: null;
    opt_length: string;
    opt_length2: string;
    opt_time: string;
    opt_time2: string;
    quest: string;
    quest_kor: string;
    seq: string;
    sub_kind: string;
    sub_kind_kor: string
  } {
    if (kind === 'writing') {
      return this.questionObject[this._current_question_index + 4];
    } else {
      return this.questionObject[this._current_question_index];
    }
  }
}
