import { Routes } from '@angular/router';
import { Signup } from './features/signup/signup';
import { authGuard } from './core/auth/auth-guard';
import { Home } from './features/home/home';
import { Groups } from './features/groups/groups';
import { Members } from './features/members/members';
import { Photos } from './features/photos/photos';
import { Profile } from './features/profile/profile';
import { LoginRequired } from './features/login-required/login-required';

export const routes: Routes = [
    {path:'signup',component:Signup},
    { path: 'login-required', component: LoginRequired},
    {
        path:'',
        canActivate:[authGuard],
        children:[
            {path:'',component:Home},
            {path:'members',component:Members},
            {path:'groups',component:Groups},
            {path:'photos',component:Photos},
            {path:'profile',component:Profile}
        ]
    },
    // fallback
    { path: '**', redirectTo: '' },

];
