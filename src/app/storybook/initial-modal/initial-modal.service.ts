import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class InitialModalService {

  modalInitialized = new Subject<string>();
  modalStartClicked = new Subject();

  constructor() {
  }
}
