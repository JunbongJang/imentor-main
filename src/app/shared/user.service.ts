import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _ho: string | null = '1';
  private _step: string | null = 'vocabulary1';
  private _section: string | null = '1';
  private _uid: string | null = '1000050543';
  private _user_id: string | null = 'testup1';
  private _user_name: string | null = '테스트업1';
  private _book_title: string | null = '';
  private _master_status: string | null = 'true';

  private _academy: string | null = '';
  private _academy_tel: string | null = '';

  constructor() { }

  convertStateToStep(input_state: string): string {
    let output_step = '';
    if (input_state === 'grammar-one') {
      output_step = 'storybook1';
    } else if (input_state === 'story-two') {
      output_step = 'storybook2';
    } else if (input_state === 'story-three') {
      output_step = 'storybook3';
    } else if (input_state === 'story-four') {
      output_step = 'storybook4';
    } else {
      output_step = input_state;
    }

    return output_step;
  }

  convertStepToState(input_step: string): string {
    let output_state = '';
    if (input_step === 'storybook1') {
      output_state = 'story-one';
    } else if (input_step === 'storybook2') {
      output_state = 'story-two';
    } else if (input_step === 'storybook3') {
      output_state = 'story-three';
    } else if (input_step === 'storybook4') {
      output_state = 'story-four';
    } else {
      output_state = input_step;
    }
    // console.log('convertStepToState: ' + output_state);
    return output_state;
  }

  get ho(): string | null {
    return this._ho;
  }

  set ho(value: string | null) {
    this._ho = value;
  }

  get step(): string | null {
    return this._step;
  }

  set step(value: string | null) {
    this._step = value;
  }

  get section(): string | null {
    return this._section;
  }

  set section(value: string | null) {
    this._section = value;
  }

  get uid(): string | null {
    return this._uid;
  }

  set uid(value: string | null) {
    this._uid = value;
  }

  get user_id(): string | null {
    return this._user_id;
  }

  set user_id(value: string | null) {
    this._user_id = value;
  }

  get user_name(): string | null {
    return this._user_name;
  }

  set user_name(value: string | null) {
    this._user_name = value;
  }

  get book_title(): string | null {
    return this._book_title;
  }

  set book_title(value: string | null) {
    this._book_title = value;
  }

  get master_status(): string | null {
    return this._master_status;
  }

  set master_status(value: string | null) {
    this._master_status = value;
  }

  get academy(): string | null {
    return this._academy;
  }

  set academy(value: string | null) {
    this._academy = value;
  }

  get academy_tel(): string | null {
    return this._academy_tel;
  }

  set academy_tel(value: string | null) {
    this._academy_tel = value;
  }
}
