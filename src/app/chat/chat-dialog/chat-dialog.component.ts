import { Component, OnInit } from '@angular/core';
import {ChatService, Message} from '../chat.service';
import {Observable} from 'rxjs';
import { scan } from 'rxjs/operators';

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
    console.log('ChatDialogComponent');
    this.messages = this.chatService.conversation.asObservable().pipe(
      scan( (acc, val) => acc.concat(val) )
  );
  }

  sendMessage() {
    this.chatService.converse(this.formValue);
    this.formValue = '';
  }

}
