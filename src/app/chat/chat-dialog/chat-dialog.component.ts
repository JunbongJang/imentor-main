import { Component, OnInit } from '@angular/core';
import {ChatService, Message} from '../chat.service';
import {Observable} from 'rxjs';
import {filter, scan, tap} from 'rxjs/operators';

@Component({
  selector: 'app-chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})
export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;

  constructor(private chatService: ChatService) { }

  ngOnInit() {
    const pop_sound = new Audio('assets/mp3/pop_sound_effect.mp3');
    console.log('ChatDialogComponent');
    this.messages = this.chatService.conversation.asObservable().pipe(
      filter((val) => val[0] !== undefined),
      filter((val) => val[0].content !== '' ),
      scan( (acc, val) => acc.concat(val) ),
      tap((val) => {
        const current_index = val.length - 1;
        if (val[current_index].sentBy !== '나') {
          pop_sound.play();
        }
        const chat_card_body = document.getElementById('chat_card_body');
        window.setTimeout(() => {
          chat_card_body.scrollTo(0, chat_card_body.scrollHeight);
        }, 0);
      })
    );
  }

  sendMessage() {
    this.chatService.converse(this.formValue);
    this.formValue = '';
  }

}
