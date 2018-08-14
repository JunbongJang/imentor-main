import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import {ViewStateService} from '../../shared/view-state.service';

@Injectable()
export class FinalModalService {

  FINAL_MODAL_RETRY = 'retry';
  FINAL_MODAL_FINISH = 'finish';
  FINAL_MODAL_NEXT = 'next';

  modalInitialized = new Subject<string>();
  modalButtonClicked = new Subject<string>();

  constructor(public viewStateService: ViewStateService) { }
}
