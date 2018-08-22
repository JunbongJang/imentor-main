import { Injectable } from '@angular/core';
import {QuestionStorageService} from './question-storage.service';
import {ServerService} from '../../core/server.service';
import {UserService} from '../../core/user.service';
import {current} from '../../../../node_modules/codelyzer/util/syntaxKind';
@Injectable()
export class QuestionGenerateService {

  constructor(private userService: UserService,
              private serverService: ServerService,
              private questionStorageService: QuestionStorageService) {
  }

  /**
   * Initialize Question From server based on different step names.
   */
  getQuestionFromServer() {
      const step_snapshot = this.userService.step;
      this.serverService.getQuestionFromServer(this.userService.step, this.userService.ho, this.userService.section ).subscribe(
        (question_xml_string) => {

          console.log('GetQuestionFromServer');
          const parser = new DOMParser();
          const parsed_xml = parser.parseFromString(question_xml_string, 'text/xml');
          console.log(parsed_xml);

          if (step_snapshot === 'storybook1') {

            console.log('storybook1');
            const question_xml = parsed_xml.getElementsByTagName('question')[0];
            this.xmlPrint(question_xml, 'o_word', 'x_word');

          } else if (step_snapshot === 'storybook2' || step_snapshot === 'storybook3') {

            console.log('2 or 3: ' + step_snapshot);
            const pgraph1 = parsed_xml.getElementsByTagName('pgraph')[0];
            const pgraph2 = parsed_xml.getElementsByTagName('pgraph')[1];
            this.xmlPrint(pgraph1, 'kor', 'cn');
            this.xmlPrint(pgraph2, 'kor', 'cn');

          } else if (step_snapshot === 'storybook4') {

            console.log('storybook4');
            const question_xml = parsed_xml.getElementsByTagName('question')[0];
            this.xmlPrint(question_xml, 'kor', 'cn');

          }

        },
        (error) => {
          console.log('error');
          console.log(error);
        });
  } // getQuestionFromServer Ends

  /**
   * helper function for getQuestioonFromServer that parses XML data and store into the local data structure
   * @param xml_object
   * @param current_step
   */
  private xmlParse(xml_object: any, current_step) {
    if (current_step === 'storybook1') {
      const a_object = {eng: '', o_word: '', x_word: ''};

      for (let i = 0; xml_object.getElementsByTagName('eng')[i] !== undefined; i++) {
        // dynamic JSON filling in
        a_object.eng = xml_object.getElementsByTagName('eng')[i].childNodes[0].nodeValue;
        if (xml_object.getElementsByTagName('o_word')[i].childNodes[0] !== undefined) {
          a_object.o_word = xml_object.getElementsByTagName('o_word')[i].childNodes[0].nodeValue;
        }
        if (xml_object.getElementsByTagName('x_word')[i].childNodes[0] !== undefined) {
          a_object.x_word = xml_object.getElementsByTagName('x_word')[i].childNodes[0].nodeValue;
        }
        this.questionStorageService.question_structure.storybook1.push(a_object);
      }
    } else {
      const a_object = {eng: '', kor: '', cn: ''};

      if (current_step === 'storybook2' || current_step === 'storybook3') {

        const pgraph1 = xml_object.getElementsByTagName('pgraph')[0];
        const pgraph2 = xml_object.getElementsByTagName('pgraph')[1];

        a_object.eng = pgraph1.getElementsByTagName('eng')[0].childNodes[0].nodeValue;
        a_object.kor = pgraph1.getElementsByTagName('kor')[0].childNodes[0].nodeValue;
        a_object.cn = pgraph1.getElementsByTagName('cn')[0].childNodes[0].nodeValue;
        this.questionStorageService.question_structure.storybook4.push(a_object);

        a_object.eng = pgraph2.getElementsByTagName('eng')[0].childNodes[0].nodeValue;
        a_object.kor = pgraph2.getElementsByTagName('kor')[0].childNodes[0].nodeValue;
        a_object.cn = pgraph2.getElementsByTagName('cn')[0].childNodes[0].nodeValue;
        this.questionStorageService.question_structure.storybook4.push(a_object);

      } else {
        for (let i = 0; xml_object.getElementsByTagName('eng')[i] !== undefined; i++) {
          // dynamic JSON filling in
          a_object.eng = xml_object.getElementsByTagName('eng')[i].childNodes[0].nodeValue;
          if (xml_object.getElementsByTagName('kor')[i].childNodes[0] !== undefined) {
            a_object.kor = xml_object.getElementsByTagName('kor')[i].childNodes[0].nodeValue;
          }
          if (xml_object.getElementsByTagName('cn')[i].childNodes[0] !== undefined) {
            a_object.cn = xml_object.getElementsByTagName('cn')[i].childNodes[0].nodeValue;
          }
          this.questionStorageService.question_structure.storybook4.push(a_object);
        }
      }

    }
  }

  /**
   * prints XML data after parsing them. So no storing into local data structure.
   * @param xml_object
   * @param first_tag
   * @param second_tag
   */
  private xmlPrint(xml_object: any, first_tag: string, second_tag: string) {
    for (let i = 0; xml_object.getElementsByTagName('eng')[i] !== undefined; i++) {
      console.log(xml_object.getElementsByTagName('eng')[i].childNodes[0].nodeValue);
      if (xml_object.getElementsByTagName(first_tag)[i].childNodes[0] !== undefined) {
        console.log(xml_object.getElementsByTagName(first_tag)[i].childNodes[0].nodeValue);
      }
      if (xml_object.getElementsByTagName(second_tag)[i].childNodes[0] !== undefined) {
        console.log(xml_object.getElementsByTagName(second_tag)[i].childNodes[0].nodeValue);
      }
    }
  }




}
