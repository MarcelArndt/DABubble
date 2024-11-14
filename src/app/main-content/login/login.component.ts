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
import { LostPasswordComponent } from './lost-password/lost-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


interface Page {
  index: number;
  type: string,
  subPages?: Page[];
}


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginAnimationComponent, CommonModule, LoginAnimationInsideComponent, RouterModule, HeadmenuLoginComponent, SubmenuLoginComponent, SignUpComponent, SignInComponent, ChooseAvatarComponent, SuccessCreatingAccountComponent, LostPasswordComponent, ResetPasswordComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',]
})

export class LoginComponent {


  pageNumber:number = 0;
  pageNumberTrashHolder:number = 0;
  isStepForwards = false;
  pageMap: Page[] = [
    {index: 0, type: 'login'},
    {index: 1, type: 'register', subPages: [{ index: 1.1, type: 'registerStep-1'}, { index: 1.2, type: 'registerStep-2'}]},
    {index: 2, type: 'lostPassword', subPages: [{ index: 2.1, type: 'lostPassword-1'}, { index: 2.2, type: 'lostPassword-2'}]},
  ]


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


  navigateToType(type: string){
    let nextPageElement = this.findPageByType(type, this.pageMap);
    console.log(nextPageElement);
  }


// Is going though PageMap -> For Each Element in PageMap it checks the Type of it and it is looking for a Match. If the type the same, it will return the correct object. otherwise it returns undefined
  findPageByType(type: string, pages: Page[]): Page | undefined {
    for (let eachPage of this.pageMap){

      if(eachPage.type == type) return eachPage;

      if(eachPage.subPages){
        let findInSubPages = this.findPageByType(type, eachPage.subPages);
        if(findInSubPages) return findInSubPages;
      }

    }
    return undefined;
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
