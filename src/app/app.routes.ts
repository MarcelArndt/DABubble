// import { Routes } from '@angular/router';
// import { MainContentComponent } from './main-content/main-content.component';
// import { LoginComponent } from './main-content/login/login.component';
// import { MainHeaderComponent } from './shared/header/main-header.component';

// export const routes: Routes = [
//     {path: '', component: LoginComponent},
//     {path: 'start', component: MainContentComponent},
//     {path: 'login', component: LoginComponent},
// ];

import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginComponent } from './main-content/login/login.component';
import { ThreadComponent } from './main-content/thread/thread.component';
import { ChatComponent } from './main-content/chat/chat.component';
import { AuthGuard } from '../guard/auth.guard';
import { ResetPasswordComponent } from './main-content/login/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'start',
    component: MainContentComponent,
    children: [
        {
            path: 'start/channels/:channelId',
            component: ChatComponent,
            canActivate: [AuthGuard] // Guard aktivieren für den Zugangsschutz
          },
          {
            path: 'start/channels/:channelId/threads/:threadId',
            component: ThreadComponent,
            canActivate: [AuthGuard]
          },
          
      { path: '', redirectTo: 'channels/welcome', pathMatch: 'full' }, // Standard auf Welcome-Channel
    ]
  },
  { path:'lost-password', component: ResetPasswordComponent}, 
];