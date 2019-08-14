import { Injectable } from '@angular/core';
import { UserDTO } from '../models/users.model';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {

    checkExist(key: string): boolean {
        return this.getItem(key) !== '' && this.getItem(key) !== undefined && this.getItem(key) !== null;
    }
    setCurrentUser(key: string, data: string) {
        this.setItem(key, data);
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }
    setItem(key: string, data: string) {
        localStorage.setItem(key, data);
    }
}