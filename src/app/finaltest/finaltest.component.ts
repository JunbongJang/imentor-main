import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from '../core/user.service';
import {ViewStateService} from '../core/view-state.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ServerService} from '../core/server.service';
import {FinaltestService} from './finaltest.service';
import {P} from '@angular/core/src/render3';
import {environment} from '../../environments/environment.prod';

@Component({
  selector: 'finaltest',
  templateUrl: './finaltest.component.html',
  styleUrls: ['./finaltest.component.css']
})
export class FinaltestComponent implements OnInit {

  current_timer_id = 'prep_timer'; // prep_timer or total_timer
  count_down_interval; // there is only one setinterval
  quest_translate_toggle = false;

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

    this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section, this.userService.kind)
      .subscribe(
      (question_json_string) => {
        const parsed_json = JSON.parse(question_json_string);
        console.log(parsed_json);
        this.finalTestService.questionObject = parsed_json;
        this.finalTestService.current_question_index = 0;
        this.finalTestService.questionInitialized.next(true);
        this.countDownTimer('prep_timer',
          parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time, 10), true);
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
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
    if (this.finalTestService.current_question_index < 3) { // because there are four questions max!
      this.finalTestService.current_question_index++;
      this.initializeClock();
      this.countDownTimer('prep_timer',
        parseInt(this.finalTestService.getCurrentQuestion(this.userService.kind).opt_time, 10), true);
    } else {
      clearInterval(this.count_down_interval);

      if (this.userService.kind === 'writing') {
        this.finalTestService.answer_list[this.finalTestService.current_question_index] =
          (<HTMLTextAreaElement>document.getElementById('answer_textarea')).value; // in case data sent before answer is saved
        this.serverService.postTestScoreToServer(this.buildQuestString(),
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
      } else { // 'speaking'

      }
    }

  } // nextQuestion ends

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


}
