import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ApiAiClient } from 'api-ai-javascript';
import {BehaviorSubject} from 'rxjs';

export class Message {
  constructor(public content: string, public sentBy: string, public sentTime: string) {}
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  readonly token = environment.dialogflow.welleasternBot;
  readonly client = new ApiAiClient({accessToken: this.token});

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  update(msg: Message) {
    console.log('update: ' + msg.content);
    this.conversation.next([msg]);
  }

  converse(msg: string) {
    if (msg !== undefined && msg !== '') {
      const userMessage = new Message(msg, '나', this.currentTime());
      this.update(userMessage);

      return this.client.textRequest(msg)
        .then(res => {
          const speech = res.result.fulfillment.speech;
          const botMessage = new Message(speech, '웰이스턴 상담원', this.currentTime());
          this.update(botMessage);
        });
    }
  }

  /**
   * https://stackoverflow.com/questions/10211145/getting-current-date-and-time-in-javascript
   */
  currentTime() {
    let datetime;
    if (this.toLocaleStringSupportsLocales()) {
      datetime = new Date().toLocaleString('ko-KR');
    } else {
      datetime = new Date().toLocaleString();
    }
    return datetime;
  }

  /**
   * helper function for currentTIme function.
   * In order to find if user browser doesn't support locale argument.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
   */
  private toLocaleStringSupportsLocales() {
    try {
      new Date().toLocaleString('i');
    } catch (e) {
      return e instanceof RangeError;
    }
    return false;
  }

}
