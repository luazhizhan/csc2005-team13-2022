import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms' // <-- NgModel lives here
import { BrowserModule } from '@angular/platform-browser'
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons'

import { AngularFireModule } from '@angular/fire/compat'
import { AngularFireAuthModule } from '@angular/fire/compat/auth'
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { CalendarModule, DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { environment } from '../environments/environment'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { AppointmentFormComponent } from './components/appointment-form/appointment-form.component'
import { CreateSampleFormComponent } from './components/create-sample-form/create-sample-form.component'
import { EndoscopeLabelComponent } from './components/endoscope-label/endoscope-label.component'
import { EventListComponent } from './components/event-list/event-list.component'
import { LoanAndRepairFormComponent } from './components/loan-and-repair-form/loan-and-repair-form.component'
import { ModalComponent } from './components/modal/modal.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { EquipmentComponent } from './equipment/equipment.component'
import { FormComponent } from './form/form.component'
import { HelpCenterComponent } from './help-center/help-center.component'
import { LoginComponent } from './login/login.component'
import { ClickOutsideDirective } from './shared/click-outside.directive'
import { SignupComponent } from './signup/signup.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    ClickOutsideDirective,
    EquipmentComponent,
    HelpCenterComponent,
    FormComponent,
    AppointmentFormComponent,
    LoanAndRepairFormComponent,
    CreateSampleFormComponent,
    EventListComponent,
    EndoscopeLabelComponent,
    ModalComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    NgHeroiconsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
