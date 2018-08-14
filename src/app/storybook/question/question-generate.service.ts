import { Injectable } from '@angular/core';
import {QuestionStorageService} from './question-storage.service';
import {ServerService} from '../../shared/server.service';
import {UserService} from '../../shared/user.service';
@Injectable()
export class QuestionGenerateService {

  constructor(private userService: UserService,
              private serverService: ServerService,
              private questionStorageService: QuestionStorageService) {
  }

    // Initialize Questions for user if current page is not result page.
  getQuestionFromServer() {
    if (this.userService.step !== 'grammer6') {
      this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho).subscribe(
        (question_xml_input) => {
          console.log('getQuestionFromServer');
          // console.log(question_xml_input);
          const parser = new DOMParser();
          const question_xml = parser.parseFromString(question_xml_input, 'text/xml');
          for (let i = 0; question_xml.getElementsByTagName('seq')[i] !== undefined; i++) {
            if (this.userService.step !== 'grammer5') {
              this.questionStorageService.question_map.set(String(i),
                {
                  seq: question_xml.getElementsByTagName('seq')[i].childNodes[0].nodeValue,
                  english: question_xml.getElementsByTagName('eng')[i].childNodes[0].nodeValue.replace(/[\[\]]/g, ''),
                  english_raw: question_xml.getElementsByTagName('eng')[i].childNodes[0].nodeValue,
                  english_parsed: this.questionStorageService.fromRawToParsed(question_xml.getElementsByTagName('eng')[i].childNodes[0].nodeValue),
                  korean: question_xml.getElementsByTagName('kor')[i].childNodes[0].nodeValue
                });
            } else {
              this.questionStorageService.question_map.set(String(i),
                {
                  seq: question_xml.getElementsByTagName('seq')[i].childNodes[0].nodeValue,
                  english: question_xml.getElementsByTagName('eng')[i].childNodes[0].nodeValue,
                  english_raw: '',
                  english_parsed: [],
                  korean: question_xml.getElementsByTagName('kor')[i].childNodes[0].nodeValue
                });
            }
          }
          this.questionStorageService.total_question_number = this.questionStorageService.question_map.size;
          // this.store.dispatch(new ViewStateActions.InitializeQuestion());
        },
        (error) => {
          console.log('error');
          console.log(error);
        });
    }
  }


}
