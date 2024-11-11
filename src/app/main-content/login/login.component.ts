import { Component } from '@angular/core';
import { LoginAnimationComponent } from './login-animation/login-animation.component';
import { LoginAnimationInsideComponent } from './login-animation-inside/login-animation-inside.component';
import { RouterModule } from '@angular/router';
import { HeadmenuLoginComponent } from './headmenu-login/headmenu-login.component';
import { SubmenuLoginComponent } from './submenu-login/submenu-login.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CommonModule } from '@angular/common';
import { ChooseAvatarComponent } from './choose-avatar/choose-avatar.component';
import { SuccessCreatingAccountComponent } from './success-creating-account/success-creating-account.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginAnimationComponent, CommonModule, LoginAnimationInsideComponent, RouterModule, HeadmenuLoginComponent, SubmenuLoginComponent, SignUpComponent, SignInComponent, ChooseAvatarComponent, SuccessCreatingAccountComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',]
})
export class LoginComponent {

  pageNumber:number = 0;
  pageNumberTrashHolder:number = 0;
  isStepForwards = false;

  changePageNumber(index:number = 0){
    if(index != this.pageNumber){
      this.pageNumberTrashHolder = this.pageNumber;
      this.pageNumber = index;
      this.checkforStepDirection();
    }  
  } 
  
  checkforStepDirection(){
    this.isStepForwards =  this.pageNumberTrashHolder < this.pageNumber ? true : false;
  }

  getClass(index:number = 0){
    let newClass = 'still-deactive';
      if(index == this.pageNumber){
        newClass = this.isStepForwards ? 'active-forwards' : 'active-backwards';
      }
      if(index - 1 == this.pageNumber && !this.isStepForwards){
        newClass = 'deactive-backwards';
      }
      if(index + 1 == this.pageNumber && this.isStepForwards){
        newClass = 'deactive-forwards';
      }
      if(this.pageNumberTrashHolder - 2 > this.pageNumber && index != this.pageNumber){
        newClass = 'still-deactive';
      }
    return newClass;
}
}
