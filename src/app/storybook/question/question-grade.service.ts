import { Injectable } from '@angular/core';
import {QuestionStorageService} from './question-storage.service';

@Injectable()
export class QuestionGradeService {

  private _test_answer_list: Array<string> = [];
  private _test_grade_list: Array<string> = [];
  private _pass_score = 90; // user passes if score is equal to or greater than 90
  private _user_pass_bool = false;
  private _correct_counter = 0;
  private _wrong_counter = 0;

  constructor(private questionStorageService: QuestionStorageService) { }

  calculateUserScore(): number {
    this._correct_counter = 0;
    for (const a_grade of this._test_grade_list) {
      if (a_grade === 'o') {
        this._correct_counter++;
      } else {
        this._wrong_counter++;
      }
    }

    this.questionStorageService.total_question_number = this._test_grade_list.length;
    const user_score = this._correct_counter / this.questionStorageService.total_question_number * 100;
    if (this._pass_score <= user_score) {
      this._user_pass_bool = true;
    }
    return user_score;
  }

  resetTestScore() {
    this._test_answer_list = [];
    this._test_grade_list = [];
    this._user_pass_bool = false;
    this._correct_counter = 0;
    this._wrong_counter = 0;
  }

  // quest	문제일련번호[!!]나의답변[!!]정답여부[@@]문제일련번호…..
  questStringBuilder(): string {
    let quest_string = '';
    let i = 0;
    for (; i < this.questionStorageService.question_map.size - 1; i++) {
      quest_string += this.questionStorageService.question_map.get(String(i)).seq + '^' +
        this._test_answer_list[i] + '^' +
        this._test_grade_list[i] + '[@@]';
    }
    quest_string += this.questionStorageService.question_map.get(String(i)).seq + '^' +
      this._test_answer_list[i] + '^' + this._test_grade_list[i];
    console.log('questStringBuilder');
    console.log(quest_string);
    return quest_string;
  }


  get test_answer_list(): Array<string> {
    return this._test_answer_list;
  }

  set test_answer_list(value: Array<string>) {
    this._test_answer_list = value;
  }

  get test_grade_list(): Array<string> {
    return this._test_grade_list;
  }

  set test_grade_list(value: Array<string>) {
    this._test_grade_list = value;
  }

  get user_pass_bool(): boolean {
    return this._user_pass_bool;
  }

  get correct_counter(): number {
    return this._correct_counter;
  }

  get wrong_counter(): number {
    return this._wrong_counter;
  }
}
