import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-addpost',
  templateUrl: './addpost.component.html',
  styleUrls: ['./addpost.component.css']
})
export class AddpostComponent implements OnInit {
  user: Object;
  userID: String;
  username: String;
  title: String;
  content: String;
  images: [];
  private: Boolean;
  
  constructor(private flashMessage: FlashMessagesService,private authService: AuthService, private router: Router) { }
  
  ngOnInit() {
  }

  onPostSubmit(){
    
    //get the current user
    this.authService.getProfile().subscribe(data =>{
      this.user = data.user;
      this.userID = data.user._id;
      this.username = data.user.username;
      //console.log(data);

      console.log(this.username);
        //create a new post

    //console.log("adding a new post");

    //checking if private is checked
    if(this.private == undefined) this.private = false;
    //console.log(this.private);
    
    //check if posts has a title
    if(!this.title){
      this.flashMessage.show("Add title to your post",{cssClass: 'alert-danger',timeout:3000});
      this.router.navigate(['/addpost']);
      return false;
    }

    //check if post has a content
    if(!this.content){
      this.flashMessage.show("Add content to your post",{cssClass: 'alert-danger',timeout:3000});
      this.router.navigate(['/addpost']);
      return false;
    }
    else{

      //createa a post object
      const post={
        userID:this.userID,
        username: this.username,
        title: this.title,
        content: this.content,
        private: this.private
    }

    //console.log("creating a new post");
    //console.log("adding post to mongo:"+post.private);
    
    //add post to database
    this.authService.addPost(post).subscribe(data=>{
      
      //adding post to posts collection was successful
      if(data.success){

        //add post to user's posts
        this.authService.updateUserPost(this.userID, this.title).subscribe(data=>{
          if(data.success){
            this.flashMessage.show("A new post added",{cssClass: 'alert-success',timeout:3000});
            this.router.navigate(['/dashboard']);
          }else{
            this.flashMessage.show("Something went wrong. Please try again",{cssClass: 'alert-danger',timeout:3000});
            this.router.navigate(['/addpost']);
          }
        });

      //something went wrong
      }else{
        this.flashMessage.show("Something went wrong. Please try again",{cssClass: 'alert-danger',timeout:3000});
        this.router.navigate(['/addpost']);
      }
      return true;
    });
  }
    },err =>{
      console.log(err);
      return false;
    });
  }
}
