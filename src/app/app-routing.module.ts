import { NgModule } from '@angular/core'
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard'
import { RouterModule, Routes } from '@angular/router'
import { DashboardComponent } from './dashboard/dashboard.component'
import { EquipmentComponent } from './equipment/equipment.component'
import { FormComponent } from './form/form.component'
import { HelpCenterComponent } from './help-center/help-center.component'
import { LoginComponent } from './login/login.component'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'
import { SignupComponent } from './signup/signup.component'

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login'])
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard'])

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectLoggedInToDashboard),
  },
  {
    path: 'signup',
    component: SignupComponent,
    ...canActivate(redirectLoggedInToDashboard),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'form',
    component: FormComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'equipment',
    component: EquipmentComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'help-center',
    component: HelpCenterComponent,
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //Insert path above this lines
  {
    path: '**',
    component: PageNotFoundComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
