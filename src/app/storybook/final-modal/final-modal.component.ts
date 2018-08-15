import { Component, OnInit } from '@angular/core';
import {FinalModalService} from './final-modal.service';
import {QuestionGradeService} from '../question/question-grade.service';
import {ViewStateService} from '../../core/view-state.service';

declare var $: any;

@Component({
  selector: 'app-final-modal',
  templateUrl: './final-modal.component.html',
  styleUrls: ['./final-modal.component.css']
})
export class FinalModalComponent implements OnInit {

  public modal_view_state = '';
  private modal_final_score = 0;

  constructor(public finalModalService: FinalModalService,
              public questionGradeService: QuestionGradeService,
              public viewStateService: ViewStateService) { }

  ngOnInit() {
    this.finalModalService.modalInitialized.subscribe(
      (final_score) => {
        console.log('finalModalService: ' + final_score);
        this.modal_final_score = parseInt(final_score, 10);
        $('#finalGrammarModalCenter').modal('show');
        // document.getElementById('finalGrammarModalButton').click();
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

  stateCongratulationString(input_state: string): string {
    let output_string = '';
    if (input_state === this.viewStateService.STORYBOOK_ONE) {
      output_string = 'Listen & Choose';
    } else if (input_state === this.viewStateService.STORYBOOK_TWO) {
      output_string = 'Read & Write';
    } else if (input_state === this.viewStateService.STORYBOOK_THREE) {
      output_string = 'Dictation';
    } else if (input_state === this.viewStateService.STORYBOOK_FOUR) {
      output_string = 'Completion';
    }
    return output_string;
  }

  retryButtonClick() {
    $('#finalGrammarModalCenter').modal('hide');
    this.finalModalService.modalButtonClicked.next(this.finalModalService.FINAL_MODAL_RETRY);
  }

  finishButtonClick() {
    $('#finalGrammarModalCenter').modal('hide');
    this.finalModalService.modalButtonClicked.next(this.finalModalService.FINAL_MODAL_FINISH);
  }

  nextButtonClick() {
    $('#finalGrammarModalCenter').modal('hide');
    this.finalModalService.modalButtonClicked.next(this.finalModalService.FINAL_MODAL_NEXT);
  }

}
