import {ServerService} from './server.service';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class UserService {


  userInitialized = new Subject<boolean>();
  user_initialized_bool = false;

  private _ho: string | null = '1';
  private _step: string | null = 'vocabulary1';
  private _section: string | null = '1';
  private _master_status: string | null = 'true';

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

  get jindo(): { book_title: string; level: string; step: string; section: string; current_storybook1: string; current_storybook2: string; current_storybook3: string; current_storybook4: string; current_speaking1: string; current_speaking2: string; current_speaking3: string; current_finaltest: string; max_storybook1: string; max_storybook2: string; max_storybook3: string; max_storybook4: string; point_vocabulary4: string; point_grammar5: string; point_speaking1: string; point_speaking2: string; point_speaking3: string; point_finaltest_speaking: string; point_finaltest_writing: string; is_complete: string } {
    return this._jindo;
  }

  set jindo(value: { book_title: string; level: string; step: string; section: string; current_storybook1: string; current_storybook2: string; current_storybook3: string; current_storybook4: string; current_speaking1: string; current_speaking2: string; current_speaking3: string; current_finaltest: string; max_storybook1: string; max_storybook2: string; max_storybook3: string; max_storybook4: string; point_vocabulary4: string; point_grammar5: string; point_speaking1: string; point_speaking2: string; point_speaking3: string; point_finaltest_speaking: string; point_finaltest_writing: string; is_complete: string }) {
    this._jindo = value;
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
          this.user_initialized_bool = true;
          this.userInitialized.next(true);
        } else {
          window.open('/user/cn/?goto=/IMENTOR/cn/main/', '_self');
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
  }
}
