import {UserService} from './user.service';
import {ActivatedRoute, Router} from '@angular/router';
import { Injectable } from "@angular/core";

@Injectable()
export class ViewStateService {

  // -------------------GLOBAL CONSTANTS----------------------
  STORYBOOK_ONE = 'story-one';
  STORYBOOK_TWO = 'story-two';
  STORYBOOK_THREE = 'story-three';
  STORYBOOK_FOUR = 'story-four';
  IMENTOR_MAIN = 'imentor-main';

  private _view_state = this.IMENTOR_MAIN;

  constructor() { }

  get view_state(): string {
    return this._view_state;
  }

  set view_state(value: string) {
    this._view_state = value;
  }
}
