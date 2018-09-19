import { Component, OnInit } from '@angular/core';
import {InitialModalService} from './initial-modal.service';
import {ViewStateService} from '../../core/view-state.service';

@Component({
  selector: 'storybook-initial-modal',
  templateUrl: './initial-modal.component.html',
  styleUrls: ['./initial-modal.component.css']
})
export class InitialModalComponent implements OnInit {

  public modal_view_state = '';

  constructor(public initialModalService: InitialModalService,
              public viewStateService: ViewStateService) { }

  ngOnInit() {
    this.initialModalService.modalInitialized.subscribe(
      (modal_state) => {
        this.modal_view_state = this.viewStateService.view_state;
        document.getElementById('storyModalButton').click();
      }, (error) => {
        console.log('error');
        console.log(error);
      });

  }

  modalButtonClick() {
    this.initialModalService.modalStartClicked.next(true);
  }
}
