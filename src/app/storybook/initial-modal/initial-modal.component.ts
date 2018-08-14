import { Component, OnInit } from '@angular/core';
import {InitialModalService} from './initial-modal.service';
import {ViewStateService} from '../../shared/view-state.service';

@Component({
  selector: 'app-initial-modal',
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
        document.getElementById('grammarModalButton').click();
      }, (error) => {
        console.log('error');
        console.log(error);
      });

    // this.store.select('view_state').subscribe(
    //   (a_view) => {
    //     if (a_view !== undefined) {
    //       this.modal_view_state = a_view[0].current_view;
    //     }
    //   },
    //   (error) => {
    //     console.log('error');
    //     console.log(error);
    //   }
    // );
  }

  modalButtonClick() {
    this.initialModalService.modalStartClicked.next(true);
  }
}
