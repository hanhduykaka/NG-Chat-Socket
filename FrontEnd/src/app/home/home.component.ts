import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as io from 'socket.io-client';
import { LocalStorageService } from '../services/localStorage.service';
import { Observable, from } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { UserDTO } from '../models/users.model';
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
  testTrackBy;
  lstFriend: Array<UserDTO>;
  constructor(
    private localStorageService: LocalStorageService,
    private httpClient: HttpClient,
  ) {
    this.socket = io.connect('http://localhost:5000');
  }

  ngOnInit() {
    this.socket.on('broad', (msgSocketId: any) => {
      this.messages.push(msgSocketId);
      this.idSocket = msgSocketId;
      this.isExist = this.localStorageService.checkExist('user');
      this.socket.emit('join', 'Hello World from client');
    });

    this.messages = new Array();
    if (this.nickName) {
      this.socket.emit('send-nickname', this.nickName);
    }


    this.socket.on('listUser', (msg: any) => {
      this.processListFriend(msg);
    });

  }


  Watcher() {
    this.getJobTemplate().subscribe((data) => {
      this.testTrackBy = data;
    });
  }

  getJobTemplate(): Observable<any> {
    // Create new HttpParams   
    return this.httpClient.get<any>('http://localhost:9999/api/randomTracby');
  }

  trackByFn(index, item) {
    return item.code;
  }

  trackByFriend(index, item) {
    return item.nickName;
  }

  chatWithFriend(listSocketId) {
    console.log(listSocketId)
  }

  submitNickname(input: KeyboardEvent) {
    const inputValue = input.target['value'];
    if (inputValue) {
      this.localStorageService.setCurrentUser('user', inputValue);
      this.nickName = inputValue;
      this.socket.emit('send-nickname', this.nickName);
      this.isExist = true;
      window.location.reload();
    }
  }

  processListFriend(msg) {
    if (msg && this.nickName) {
      this.lstFriend = msg;
      this.lstFriend = this.lstFriend.filter(x => {
        return x.nickname !== this.nickName;
      });
    }
  }



  sendMessage() {
    const message = {
      text: this.messageText
    };
    this.socket.emit('send-message', message);
    this.messageText = '';
  }

  logout() {
    this.localStorageService.clear('user');
    window.location.reload();
    this.isExist = false;
  }

}
