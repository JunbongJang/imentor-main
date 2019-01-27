import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinaltestService} from '../finaltest.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'writing-test',
  templateUrl: './writing-test.component.html',
  styleUrls: ['./writing-test.component.css']
})
export class WritingTestComponent implements OnInit, OnDestroy {

  textarea_focused = false;
  current_image_none = false;
  nextQuestionCalledSubs: Subscription;
  prepDoneSubs: Subscription;

  constructor(public finalTestService: FinaltestService) { }

  ngOnInit() {
    const textarea_elem = <HTMLTextAreaElement>document.getElementById('answer_textarea');

    this.nextQuestionCalledSubs = this.finalTestService.nextQuestionCalled.subscribe((called_bool: boolean) => {
      this.finalTestService.answer_list[this.finalTestService.current_question_index] = textarea_elem.value;
      this.current_image_none = false;
      textarea_elem.value = '';
      textarea_elem.disabled = true;
    }, (error) => {
      console.log(error);
    });

    this.prepDoneSubs = this.finalTestService.prepDoneCalled.subscribe((called_bool: boolean) => {
      textarea_elem.disabled = false;
      textarea_elem.focus();
    }, (error) => {
      console.log(error);
    });

  }

  ngOnDestroy() {
    this.nextQuestionCalledSubs.unsubscribe();
    this.prepDoneSubs.unsubscribe();
  }

  rawTextExist() {
    if (this.finalTestService.getCurrentQuestion('writing').ex_txt !== null &&
      this.finalTestService.getCurrentQuestion('writing').ex_txt !== '') {
      return true;
    }
    return false;
  }

  rawTextToParagraph() {
    const raw_text = this.finalTestService.getCurrentQuestion('writing').ex_txt;
    const html_text = raw_text.replace(/\[@@\]/g, '<br>');
    return html_text;
  }

}
