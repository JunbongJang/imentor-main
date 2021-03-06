import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment.prod';

@Injectable()
export class UserService {


  userInitialized = new Subject<boolean>();
  user_initialized_bool = false;

  imentor_best_ho_map = {
    'best1': 13,
    'best2': 16,
    'best3': 18,
    'best4': 20,
    'best5': 21,
    'best6': 22,
    'best7': 19,
    'best8': 24,
  }

  private _ho: string | null = '1';
  private _view_ho: string | null = '1';
  private _step: string | null = 'vocabulary1';
  private _section: string | null = '1';
  private _master_status: string | null = 'true';
  private _kind: string | null = 'speaking';

  private _calendar = {
    month: '1',
    year: '2019'
  };

  private _user = {
    uid: '1000050543',
    user_id: 'testup1',
    name: '테스트업1',
    mb_level: '3',
    level: '1',
    grade: '1',
    school_name: '',
    perm: '1'
  };

  private _jindo = {
    book_title: 'Don\'t be Greedy!',
    level: '1',
    step: 'finaltest',
    section: '1',
    current_storybook1: '1',
    current_storybook2: '1',
    current_storybook3: '',
    current_storybook4: '1',
    current_speaking1: '',
    current_speaking2: '1',
    current_speaking3: '2',
    current_finaltest: '',

    max_storybook1: '7',
    max_storybook2: '7',
    max_storybook3: '7',
    max_storybook4: '7',

    max_speaking1: '7',
    max_speaking2: '7',
    max_speaking3: '3',

    point_vocabulary4: '23',
    point_grammar5: '34',
    point_speaking1: '54',
    point_speaking2: '23',
    point_speaking3: '100',
    point_finaltest_speaking: '20',
    point_finaltest_writing: '45',
    is_complete: '0'
  };

  constructor(private serverService: ServerService) { }

  convertStateToStep(input_state: string): string {
    let output_step = '';
    if (input_state === 'grammar-one') {
      output_step = 'storybook1';
    } else if (input_state === 'story-two') {
      output_step = 'storybook2';
    } else if (input_state === 'story-three') {
      output_step = 'storybook3';
    } else if (input_state === 'story-four') {
      output_step = 'storybook4';
    } else {
      output_step = input_state;
    }

    return output_step;
  }

  convertStepToState(input_step: string): string {
    let output_state = '';
    if (input_step === 'storybook1') {
      output_state = 'story-one';
    } else if (input_step === 'storybook2') {
      output_state = 'story-two';
    } else if (input_step === 'storybook3') {
      output_state = 'story-three';
    } else if (input_step === 'storybook4') {
      output_state = 'story-four';
    } else {
      output_state = input_step;
    }
    // console.log('convertStepToState: ' + output_state);
    return output_state;
  }

  get ho(): string | null {
    return this._ho;
  }

  set ho(value: string | null) {
    this._ho = value;
  }

  get view_ho(): string | null {
    return this._view_ho;
  }

  set view_ho(value: string | null) {
    this._view_ho = value;
  }

  get step(): string | null {
    return this._step;
  }

  set step(value: string | null) {
    this._step = value;
  }

  get section(): string | null {
    return this._section;
  }

  set section(value: string | null) {
    this._section = value;
  }

  get kind(): string | null {
    return this._kind;
  }

  set kind(value: string | null) {
    this._kind = value;
  }

  get master_status(): string | null {
    return this._master_status;
  }

  set master_status(value: string | null) {
    this._master_status = value;
  }


  get user(): { uid: string; user_id: string; name: string; mb_level: string; level: string; grade: string; school_name: string; perm: string } {
    return this._user;
  }

  set user(value: { uid: string; user_id: string; name: string; mb_level: string; level: string; grade: string; school_name: string; perm: string }) {
    this._user = value;
  }

  get jindo(): { book_title: string; level: string; step: string; section: string; current_storybook1: string; current_storybook2: string; current_storybook3: string; current_storybook4: string; current_speaking1: string; current_speaking2: string; current_speaking3: string; current_finaltest: string; max_storybook1: string; max_storybook2: string; max_storybook3: string; max_storybook4: string; max_speaking1: string; max_speaking2: string; max_speaking3: string; point_vocabulary4: string; point_grammar5: string; point_speaking1: string; point_speaking2: string; point_speaking3: string; point_finaltest_speaking: string; point_finaltest_writing: string; is_complete: string } {
    return this._jindo;
  }

  set jindo(value: { book_title: string; level: string; step: string; section: string; current_storybook1: string; current_storybook2: string; current_storybook3: string; current_storybook4: string; current_speaking1: string; current_speaking2: string; current_speaking3: string; current_finaltest: string; max_storybook1: string; max_storybook2: string; max_storybook3: string; max_storybook4: string; max_speaking1: string; max_speaking2: string; max_speaking3: string; point_vocabulary4: string; point_grammar5: string; point_speaking1: string; point_speaking2: string; point_speaking3: string; point_finaltest_speaking: string; point_finaltest_writing: string; is_complete: string }) {
    this._jindo = value;
  }

  get calendar(): { month: string; year: string } {
    return this._calendar;
  }

  set calendar(value: { month: string; year: string }) {
    this._calendar = value;
  }

  setUserFromServer() {
    this.serverService.getUserFromServer().subscribe(
      (user_xml_string) => {
        console.log('getUserFromServer: ');
        const parser = new DOMParser();
        const user_xml = parser.parseFromString(user_xml_string, 'text/xml');

        this.user.perm = user_xml.getElementsByTagName('perm')[0].childNodes[0].nodeValue;
        if (this.user.perm !== '' && parseInt(this.user.perm, 10) > 0) {
          this.user.uid = user_xml.getElementsByTagName('uid')[0].childNodes[0].nodeValue;
          this.user.user_id = user_xml.getElementsByTagName('user_id')[0].childNodes[0].nodeValue;
          this.user.name = user_xml.getElementsByTagName('name')[0].childNodes[0].nodeValue;
          this.user.mb_level = user_xml.getElementsByTagName('mb_level')[0].childNodes[0].nodeValue;
          this.user.level = user_xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
          this.user.grade = user_xml.getElementsByTagName('grade')[0].childNodes[0].nodeValue;
          console.log(this.user);

          this.master_status = (parseInt(this.user.mb_level, 10) > 2) ? 'true' : 'false';
          this.ho = this.user.level;
          this.view_ho = this.hoToViewHo(this.ho);
          this.user_initialized_bool = true;
          this.userInitialized.next(true);
        } else {
          alert('EMS에서 마이멘토 레벨이 지정되지 않았습니다.');
          if (environment.chinese) {
            window.open('/onacademy/', '_self');
          } else {
            window.open('/onacademy/korea.html', '_self');
          }
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
  }

  /**
   * newly added on 6/21/2019 because of china.
   * 중국용 호수 변경
   * @param input_ho
   */
  hoToViewHo(input_ho: string): string {
    let local_view_ho: string = input_ho;
    if (environment.chinese) {
      if (input_ho === '10') {
        local_view_ho = '9';
      } else if (input_ho === '11') {
        local_view_ho = '10';
      } else if (input_ho === '13') {
        local_view_ho = 'Best1';
      } else if (input_ho === '16') {
        local_view_ho = 'Best2';
      } else if (input_ho === '18') {
        local_view_ho = 'Best3';
      } else if (input_ho === '20') {
        local_view_ho = 'Best4';
      } else if (input_ho === '21') {
        local_view_ho = 'Best5';
      } else if (input_ho === '22') {
        local_view_ho = 'Best6';
      } else if (input_ho === '19') {
        local_view_ho = 'Best7';
      } else if (input_ho === '24') {
        local_view_ho = 'Best8';
      }
    }
    return local_view_ho;
  }

  viewHoToHo(view_ho: string): string {
    let local_ho: string = view_ho;
    if (environment.chinese) {
      if (view_ho === '9') {
        local_ho = '10';
      } else if (view_ho === '10') {
        local_ho = '11';
      } else if (view_ho === 'Best1') {
        local_ho = '13';
      } else if (view_ho === 'Best2') {
        local_ho = '16';
      } else if (view_ho === 'Best3') {
        local_ho = '18';
      } else if (view_ho === 'Best4') {
        local_ho = '20';
      } else if (view_ho === 'Best5') {
        local_ho = '21';
      } else if (view_ho === 'Best6') {
        local_ho = '22';
      } else if (view_ho === 'Best7') {
        local_ho = '19';
      } else if (view_ho === 'Best8') {
        local_ho = '24';
      }
    }

    return local_ho;
  }

  isImentorBest(): boolean {
    if (parseInt(this.ho, 10) < 12) {
      return false;
    } else {
      return true;
    }
  }
}
