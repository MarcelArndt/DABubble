import { Routes } from '@angular/router';
import { MainContentComponent } from './main-content/main-content.component';
import { LoginComponent } from './main-content/login/login.component';
import { MainHeaderComponent } from './shared/header/main-header.component';

export const routes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'start', component: MainContentComponent},
    {path: 'login', component: LoginComponent},
];
