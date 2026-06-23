import { Injectable } from '@angular/core';
import usersData from '../data/users.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  users = usersData.users;

  /*login(email: string, password: string){

    const user = this.users.find(
      u =>
      u.email === email &&
      u.password === password
    );

    if(user){

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      return true;
    }

    return false;
  }

  logout(){
    localStorage.removeItem('user');
  }

  isLoggedIn(){
    return !!localStorage.getItem('user');
  }*/
 login(email: string, password: string){

  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Usuarios:', this.users);

  const user = this.users.find(
    (u: any) =>
      u.email === email &&
      u.password === password
  );

  console.log('Usuario encontrado:', user);

  if(user){
    localStorage.setItem(
      'user',
      JSON.stringify(user)
    );

    return true;
  }

  return false;
}
}