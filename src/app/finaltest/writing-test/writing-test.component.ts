import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinaltestService} from '../finaltest.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../core/user.service';
import {ServerService} from '../../core/server.service';

@Component({
  selector: 'writing-test',
  templateUrl: './writing-test.component.html',
  styleUrls: ['./writing-test.component.css']
})
export class WritingTestComponent implements OnInit, OnDestroy {

  textarea_focused = false;
  nextQuestionCalledSubs: Subscription;
  prepDoneSubs: Subscription;

  constructor(public finalTestService: FinaltestService,
              private userService: UserService,
              private serverService: ServerService) { }

  ngOnInit() {
    const textarea_elem = <HTMLTextAreaElement>document.getElementById('answer_textarea');

    this.nextQuestionCalledSubs = this.finalTestService.nextQuestionCalled.subscribe((called_bool: boolean) => {
      this.finalTestService.answer_list[this.finalTestService.current_question_index] = textarea_elem.value;
      textarea_elem.value = '';
      textarea_elem.disabled = true;

      if (this.finalTestService.current_question_index >= 3) {
        this.serverService.postTestScoreToServer(this.buildQuestString(),
          this.userService.kind, this.userService.user.uid,
          this.userService.user.user_id, this.userService.step, this.userService.ho).subscribe(
          (post_reply) => {
            console.log('postTestScoreToServer: ' + post_reply);
          }, (error) => {
            console.log('error');
            console.log(error);
          });
      }
    }, (error) => {
      console.log(error);
    });

    this.prepDoneSubs = this.finalTestService.prepDoneCalled.subscribe((called_bool: boolean) => {
      textarea_elem.disabled = false;
    }, (error) => {
      console.log(error);
    });

  }

  ngOnDestroy() {
    this.nextQuestionCalledSubs.unsubscribe();
    this.prepDoneSubs.unsubscribe();
  }

  rawTextToParagraph() {
    const raw_text = this.finalTestService.getCurrentQuestion('writing').ex_txt;
    const html_text = raw_text.replace(/\[@@\]/g, '<br>');
    return html_text;
  }

  buildQuestString() {
    let start_index = 5;
    let quest_string = '';
    // e.g. 5^[@@]6^dsfdsfsdgfdg[@@]7^dsfdsfdsfddsfsd[@@]8^sdfdsfdsdfdssdf
    for (const an_answer of this.finalTestService.answer_list) {
      quest_string += start_index + '^' + an_answer + '[@@]';
      start_index += 1;
    }
    return quest_string;
  }

}
