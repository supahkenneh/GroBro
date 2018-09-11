import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  user: {
    id: number;
    loggedIn: boolean;
    username: string;
    first_name: string;
    last_name: string;
    bio: string;
    city: string;
    state: string;
    stand: string;
    rating: number;
  } = {
      id: -1,
      loggedIn: false,
      username: '',
      first_name: '',
      last_name: '',
      bio: '',
      city: '',
      state: '',
      stand: '',
      rating: -1
    };

  constructor() {
    let userString = window.localStorage.getItem('user');
    try {
      if (userString) {
        this.user = JSON.parse(userString);
      } else {
        console.log('user was not found');
      }
    } catch (err) {
      console.log('could not parse user');
    }
  }

  getSession() {
    return this.user;
  }

  setSession(data) {
    console.log('data :', data);
    this.user.id = data.id;
    this.user.loggedIn = true;
    this.user.username = data.username;
    this.user.first_name = data.first_name;
    this.user.last_name = data.last_name;
    this.user.rating = data.rating;
    this.user.bio = data.bio;
    this.user.city = data.city;
    this.user.state = data.state;
    this.user.stand = data.stand_name;

    let userString = JSON.stringify(this.user);
    window.localStorage.setItem('user', userString);
  }

  clearSession() {
    this.user.loggedIn = false;
    this.user.username = '';
    this.user.first_name = '';
    this.user.last_name = '';
    this.user.rating = -1;
    this.user.bio = '';
    this.user.city = '';
    this.user.state = '';
    this.user.stand = '';
    window.localStorage.removeItem('user');
  }

  isLoggedIn() {
    return this.user.loggedIn;
  }
}
