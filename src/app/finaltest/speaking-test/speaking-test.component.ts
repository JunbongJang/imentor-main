import {Component, OnDestroy, OnInit} from '@angular/core';
import {FinaltestService} from '../finaltest.service';
import {UserService} from '../../core/user.service';
import {ServerService} from '../../core/server.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'speaking-test',
  templateUrl: './speaking-test.component.html',
  styleUrls: ['./speaking-test.component.css']
})
export class SpeakingTestComponent implements OnInit, OnDestroy {

  nextQuestionCalledSubs: Subscription;
  prepDoneSubs: Subscription;

  constructor(public finalTestService: FinaltestService,
              private userService: UserService,
              private serverService: ServerService) { }

  ngOnInit() {
    this.nextQuestionCalledSubs = this.finalTestService.nextQuestionCalled.subscribe((called_bool: boolean) => {
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
      console.log('prep_done');
    }, (error) => {
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.nextQuestionCalledSubs.unsubscribe();
    this.prepDoneSubs.unsubscribe();
  }

  buildQuestString() {
    let start_index = 1;
    let quest_string = '';
    // e.g. 5^[@@]6^dsfdsfsdgfdg[@@]7^dsfdsfdsfddsfsd[@@]8^sdfdsfdsdfdssdf
    for (const an_answer of this.finalTestService.answer_list) {
      quest_string += start_index + '^' + an_answer + '[@@]';
      start_index += 1;
    }
    return quest_string;
  }

}
