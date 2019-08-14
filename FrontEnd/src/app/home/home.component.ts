import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { LocalStorageService } from '../services/localStorage.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messageText: string;
  messages: Array<any>;
  socket: SocketIOClient.Socket;
  idSocket: string;
  isExist: boolean;
  nickName: string = this.localStorageService.getItem('user');

    constructor(
      private localStorageService: LocalStorageService
    ) {
  this.socket = io.connect('http://localhost:5000');
}

ngOnInit() {
  this.socket.on('broad', (msg: any) => {
    this.messages.push(msg);
    this.idSocket = msg;
    this.isExist = this.localStorageService.checkExist('user');
  });

  this.messages = new Array();


  this.socket.emit('event1', {
    msg: 'Client to server, can you hear me server?'
  });

}


submitNickname(input: KeyboardEvent) {
  const inputValue = input.target['value'];
  if (inputValue) {
    this.localStorageService.setCurrentUser('user', inputValue);
    this.nickName = inputValue;
    this.isExist = true;
  }
}

sendMessage() {
  const message = {
    text: this.messageText
  };
  this.socket.emit('send-message', message);
  this.messageText = '';
}

}
