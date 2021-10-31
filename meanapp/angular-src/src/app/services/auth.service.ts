import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';



@Injectable()
export class AuthService {
  authToken : any;
  user: any;
  post: any;


  constructor(private http:Http) { }

  addPost(postcontent){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    console.log("adding post to db");
    
    return this.http.post('http://localhost:8080/users/addpost',postcontent,{headers:headers}).map(res=>res.json());
  }

  //register the user
  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:8080/users/register/',user,{headers:headers}).map(res=>res.json());
  }


  //authenticate the user
  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:8080/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  //store the data = add them to localstorage
  storeUserData(token, user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user',JSON.stringify(user));
    this.authToken= token;
    this.user = user;
  }
  storeCurrentPost(post){
    localStorage.setItem('post', post._id);
    this.post = post;
    console.log(post);
    

  }

  //logout
  logout(){
    this.authToken = null;
    this.user = null;
    this.post = null;
    localStorage.clear();
  }
  
  //get token form local storage and run it in the getProfile
  loadToken(){
    const token  = localStorage.getItem('id_token');
    this.authToken = token;
  }
  loadPost(){
    const post = localStorage.getItem('post');
    this.post = post;
    console.log("load post id:"+this.post);
  }


  //getting a profile
  getProfile(){
    let headers = new Headers();

    //getting the token 
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/users/profile', {headers: headers})
      .map(res => res.json());
  }

  getPost(){
    let headers = new Headers();
    this.loadToken();
    this.loadPost();

    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json'); 
    let id = this.post
    let url = 'http://localhost:8080/users/post/'+id;
    //console.log(url);
    return this.http.get(url, {headers: headers})
      .map(res => res.json());
  
  }

  getPosts(){
    let headers = new Headers();

    //getting the token 
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:8080/users/posts', {headers: headers})
      .map(res => res.json());
  }

  //check if logged in and token not expired
  loggedIn(){
    return tokenNotExpired("id_token");
  }
}
