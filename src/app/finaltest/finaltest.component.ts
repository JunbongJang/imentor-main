import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {ViewStateService} from '../core/view-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ServerService} from '../core/server.service';
import {FinaltestService} from './finaltest.service';
import {environment} from '../../environments/environment.prod';
import {Subscription} from 'rxjs';

@Component({
  selector: 'finaltest',
  templateUrl: './finaltest.component.html',
  styleUrls: ['./finaltest.component.css']
})
export class FinaltestComponent implements OnInit, OnDestroy {

  current_timer_id = 'prep_timer'; // prep_timer or total_timer
  count_down_interval; // there is only one setinterval
  quest_translate_toggle = false;
  listened_voice_bool = false;

  getQuestionFromServerSubs: Subscription;
  listenedVoiceSubs: Subscription;

  constructor(private titleService: Title,
              public userService: UserService,
              public viewStateService: ViewStateService,
              private serverService: ServerService,
              public finalTestService: FinaltestService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    document.body.style.backgroundColor = 'rgb(88, 73, 53)';
    this.titleService.setTitle( 'i-MENTOR Storybook' );

    this.getQuestionFromServerSubs = this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section, this.userService.kind)
      .subscribe(
      (question_json_string) => {
        const parsed_json = JSON.parse(question_json_string);
        console.log(parsed_json);
        this.finalTestService.questionObject = parsed_json;
        this.finalTestService.current_question_index = 0;
        this.finalTestService.questionInitialized.next(true);
        this.countDownTimer('prep_timer',
          parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time, 10), true);
        // this.countDownTimer('prep_timer', 1, true);
      },
      (error) => {
        console.log('error');
        console.log(error);
      });

    this.listenedVoiceSubs = this.finalTestService.listenedVoice.subscribe(
        (recorded_bool: boolean) => {
          console.log('listened_bool: ' + recorded_bool);
          this.listened_voice_bool = recorded_bool;
        },
        (error) => {
          console.log('error');
          console.log(error);
        });

  }

  ngOnDestroy() {
    this.getQuestionFromServerSubs.unsubscribe();
    this.listenedVoiceSubs.unsubscribe();
  }

  viewStateChoose(a_view: string) {
    if (a_view === this.viewStateService.IMENTOR_MAIN) {
      clearInterval(this.count_down_interval);
      this.viewStateService.view_state = a_view;
      this.router.navigate(['main']);
    }
  }

  navigateQuestion(question_num: number): void {
    this.finalTestService.current_question_index = question_num - 1;
  }

  nextQuestion() {
    this.finalTestService.nextQuestionCalled.next(true); // save the data in buffer
    this.listened_voice_bool = false;

    if (this.finalTestService.current_question_index < 3) { // because there are four questions max!
      this.finalTestService.current_question_index++;
      this.initializeClock();
      this.countDownTimer('prep_timer',
        parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time, 10), true);
    } else { // --------------- This was the last question ---------------------------
      clearInterval(this.count_down_interval);

      if (this.userService.kind === 'writing') {
        this.finalTestService.answer_list[this.finalTestService.current_question_index] =
          (<HTMLTextAreaElement>document.getElementById('answer_textarea')).value; // in case data sent before answer is saved
        this.serverService.postTestAnswerToServer(this.buildQuestString(),
          this.userService.kind, this.userService.user.uid,
          this.userService.user.user_id, this.userService.step, this.userService.ho).subscribe(
          (post_reply) => {
            console.log('postTestScoreToServer: ' + post_reply);
            this.viewStateService.view_state = this.viewStateService.IMENTOR_MAIN;
            this.router.navigate(['main']);
          }, (error) => {
            console.log('error');
            console.log(error);
          });

      } else { // kind === 'speaking'
        this.serverService.postTestAnswerToServer(this.buildQuestString(),
          this.userService.kind, this.userService.user.uid,
          this.userService.user.user_id, this.userService.step, this.userService.ho).subscribe(
          (post_reply) => {
            console.log('postTestScoreToServer: ' + post_reply);
            this.viewStateService.view_state = this.viewStateService.IMENTOR_MAIN;
            this.router.navigate(['main']);
          }, (error) => {
            console.log('error');
            console.log(error);
          });
      }
    }

  } // nextQuestion ends

  buildQuestString() {
    let start_index = 1;
    let quest_string = '';
    if (this.userService.kind === 'writing') {
      // example:. 5^[@@]6^dsfdsfsdgfdg[@@]7^dsfdsfdsfddsfsd[@@]8^sdfdsfdsdfdssdf
      start_index = 5;
      for (const an_answer of this.finalTestService.answer_list) {
        quest_string += start_index + '^' + an_answer + '[@@]';
        start_index += 1;
      }
    } else {
      // example: 1^1000050540_1_201931722318.wma[@@]2^1000050540_1_201931722342.wma[@@]3^1000050540_1_201931722358.wma[@@]4^1000050540_1_2019317221439.wma
      for (const an_answer of this.finalTestService.answer_list) {
        quest_string += start_index + '^' + an_answer + '[@@]';
        start_index += 1;
      }
    }

    return quest_string;
  }


  prepDone() {
    clearInterval(this.count_down_interval);
    this.finalTestService.prepDoneCalled.next(true);
    this.countDownTimer('total_timer',
      parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time2, 10), false);
  }

  countDownTimer(timer_id: string, start_time: number, prep_timer_bool: boolean) {
    let time_left = start_time;
    this.current_timer_id = timer_id;
    document.getElementById(timer_id).innerHTML = this.clockDisplayHTML(time_left);
    this.count_down_interval = setInterval(() => {
      console.log('count down');
      if (time_left > 0) {
        time_left -= 1;
        document.getElementById(timer_id).innerHTML = this.clockDisplayHTML(time_left);
      } else {
        if (prep_timer_bool) {
          this.prepDone();
        } else {
          this.nextQuestion();
        }
      }
    }, 1000);
  }

  initializeClock() {
    clearInterval(this.count_down_interval);
    document.getElementById('prep_timer').innerHTML = this.clockDisplayHTML(
      parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time, 10)
    );
    document.getElementById('total_timer').innerHTML = this.clockDisplayHTML(
      parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time2, 10)
    );
  }

  clockDisplayHTML(time_left: number) {
    const minutes = Math.floor(time_left / 60);
    const seconds = time_left % 60;
    let minutes_string = '';
    let seconds_string = '';
    if (minutes < 10) {
      minutes_string = '0' + minutes.toString();
    } else {
      minutes_string = minutes.toString();
    }

    if (seconds < 10) {
      seconds_string = '0' + seconds.toString();
    } else {
      seconds_string = seconds.toString();
    }

    return minutes_string + ':' + seconds_string;
  }

  translateQuest() {
    this.quest_translate_toggle = !this.quest_translate_toggle;
    if (this.quest_translate_toggle) {
      document.getElementById('translatable_quest').innerText = this.finalTestService.getCurrentQuestion(this.userService.kind).quest_kor;
    } else {
      document.getElementById('translatable_quest').innerText = this.finalTestService.getCurrentQuestion(this.userService.kind).quest;
    }
  }

  translateButtonLabel() {
    let button_lable = '';
    if (this.quest_translate_toggle) {
      if (environment.chinese) {
        button_lable = 'translate';
      } else {
        button_lable = '영문 보기';
      }
    } else {
      if (environment.chinese) {
        button_lable = 'translate';
      } else {
        button_lable = '한글 해석';
      }
    }
    return button_lable;
  }

  isNextQuestionButtonDisabled() {
    let next_question_button_disabled = true;
    if (this.current_timer_id === 'prep_timer') {
      next_question_button_disabled = true;
    } else if (this.userService.kind === 'writing' && this.current_timer_id !== 'prep_timer') {
      next_question_button_disabled = false;
    } else if (this.userService.kind === 'speaking' && this.listened_voice_bool) {
      next_question_button_disabled = false;
    }

    return next_question_button_disabled;
  }


}
