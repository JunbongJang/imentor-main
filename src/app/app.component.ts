import {Component, OnInit} from '@angular/core';
import {ViewStateService} from './core/view-state.service';
import {UserService} from './core/user.service';
import {ServerService} from './core/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private viewStateService: ViewStateService,
              private userService: UserService,
              private serverService: ServerService) {
  }

  ngOnInit() {
    const url = new URL(window.location.href);
    console.log(window.location.href);

    // initialize user if it's not localhost
    if (url.host.indexOf('localhost') !== 0) {
    this.serverService.getUserFromServer().subscribe(
      (user_xml_string) => {
        console.log('getUserFromServer: ');
        const parser = new DOMParser();
        const user_xml = parser.parseFromString(user_xml_string, 'text/xml');
        console.log(user_xml);
        this.userService.user.perm = user_xml.getElementsByTagName('perm')[0].childNodes[0].nodeValue;
        if (parseInt(this.userService.user.perm, 10) > 0) {
          this.userService.user.uid = user_xml.getElementsByTagName('uid')[0].childNodes[0].nodeValue;
          this.userService.user.user_id = user_xml.getElementsByTagName('user_id')[0].childNodes[0].nodeValue;
          this.userService.user.name = user_xml.getElementsByTagName('name')[0].childNodes[0].nodeValue;
          this.userService.user.mb_level = user_xml.getElementsByTagName('mb_level')[0].childNodes[0].nodeValue;
          this.userService.user.level = user_xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
          this.userService.user.grade = user_xml.getElementsByTagName('grade')[0].childNodes[0].nodeValue;


          console.log('----------------------------------------------');

          const jindo_xml = user_xml.getElementsByTagName('jindo')[0];
          this.userService.jindo.book_title = jindo_xml.getElementsByTagName('book_title')[0].childNodes[0].nodeValue;
          this.userService.jindo.level = jindo_xml.getElementsByTagName('level')[0].childNodes[0].nodeValue;
          this.userService.jindo.step = jindo_xml.getElementsByTagName('step')[0].childNodes[0].nodeValue;
          this.userService.jindo.section = jindo_xml.getElementsByTagName('section')[0].childNodes[0].nodeValue;
          this.userService.jindo.current_storybook1 = jindo_xml.getElementsByTagName('section_storybook1')[0].getAttribute('thisJindo');
          this.userService.jindo.current_storybook2 = jindo_xml.getElementsByTagName('section_storybook2')[0].getAttribute('thisJindo');
          this.userService.jindo.current_storybook3 = jindo_xml.getElementsByTagName('section_storybook3')[0].getAttribute('thisJindo');
          this.userService.jindo.current_storybook4 = jindo_xml.getElementsByTagName('section_storybook4')[0].getAttribute('thisJindo');
          this.userService.jindo.current_speaking1 = jindo_xml.getElementsByTagName('section_speaking1')[0].getAttribute('thisJindo');
          this.userService.jindo.current_speaking2 = jindo_xml.getElementsByTagName('section_speaking2')[0].getAttribute('thisJindo');
          this.userService.jindo.current_speaking3 = jindo_xml.getElementsByTagName('section_speaking3')[0].getAttribute('thisJindo');
          this.userService.jindo.current_finaltest = jindo_xml.getElementsByTagName('section_finaltest')[0].getAttribute('thisJindo');

          this.userService.jindo.point_vocabulary4 = jindo_xml.getElementsByTagName('point')[0].getAttribute('vocabulary4');
          this.userService.jindo.point_grammar5 = jindo_xml.getElementsByTagName('point')[0].getAttribute('grammer5');
          this.userService.jindo.point_speaking1 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking1');
          this.userService.jindo.point_speaking2 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking2');
          this.userService.jindo.point_speaking3 = jindo_xml.getElementsByTagName('point')[0].getAttribute('speaking3');
          this.userService.jindo.point_finaltest_speaking = jindo_xml.getElementsByTagName('point')[0].getAttribute('finaltest_speaking');
          this.userService.jindo.point_finaltest_writing = jindo_xml.getElementsByTagName('point')[0].getAttribute('finaltest_writing');
          this.userService.jindo.is_complete = jindo_xml.getElementsByTagName('point')[0].getAttribute('is_complete');

          console.log('----------------------------------------------');

          const calender_xml = user_xml.getElementsByTagName('attendance')[0];

          console.log('----------------------------------------------');
          console.log(this.userService.user);
          console.log(this.userService.jindo);

          this.userService.master_status = (parseInt(this.userService.user.mb_level, 10) > 2) ? 'true' : 'false';
          this.userService.ho = this.userService.user.level;
        } else {
          alert('User is not logged in.');
          window.open('/user?goto=https://www.easternschool.co.kr', '_self');
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      });
    }

    // this.serverService.getCalendarFromServer('7', '1', '2018').subscribe(
    //   (calendar_xml_string) => {
    //     console.log('getCalendarFromServer: ');
    //     console.log(calendar_xml_string);
    //   }
    // );

  }

  getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }
}
