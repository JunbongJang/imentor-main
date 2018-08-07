import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatDialogComponent } from './chat-dialog/chat-dialog.component';
import {FormsModule} from '@angular/forms';
import {ChatService} from './chat.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    ChatDialogComponent
  ],
  declarations: [ChatDialogComponent, ChatDialogComponent],
  providers: [ChatService]
})
export class ChatModule { }
