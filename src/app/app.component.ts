import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { combineLatest } from 'rxjs'
import { AuthService } from './shared/auth.service'
import { AppointmentService } from './shared/data/appointment.service'
import { LoanService } from './shared/data/loan.service'
import { RepairService } from './shared/data/repair.service'
import { ScopeSampleService } from './shared/data/scope-sample.service'
import { WasherSampleService } from './shared/data/washer-sample.service'

type Notification = {
  type: 'appointment' | 'loan' | 'repair' | 'washer' | 'scope'
  data: any
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  user$ = this.authService.checkAuthState()

  hideProfileDropDown = true

  hideNotificationDropDown = true

  today = new Date()

  notifications: {
    type: 'appointment' | 'loan' | 'repair' | 'washer' | 'scope'
    data: any
  }[] = []

  constructor(
    private appointmentService: AppointmentService,
    private scopeSampleService: ScopeSampleService,
    private washerSampleService: WasherSampleService,
    private loanService: LoanService,
    private repairService: RepairService,

    private authService: AuthService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const appointments$ =
      this.appointmentService.getAppointmentsByDateAndIncharge(
        this.today,
        this.authService.getCurrentUser().id
      )
    const loans$ = this.loanService.getUnreturnsLoans()
    const repairs$ = this.repairService.getUnreturnedRepairs()
    const washers$ = this.washerSampleService.getAwaitingResults()
    const scopes$ = this.scopeSampleService.getAwaitingResults()
    combineLatest([
      appointments$,
      loans$,
      repairs$,
      washers$,
      scopes$,
    ]).subscribe(([appointments, loans, repairs, washers, scopes]) => {
      this.notifications = [
        ...appointments.map(a => ({ type: 'appointment', data: a })),
        ...loans.map(l => ({ type: 'loan', data: l })),
        ...repairs
          .filter(
            r => this.today.toDateString() === r.expectedDate.toDateString()
          )
          .map(r => ({ type: 'repair', data: r })),
        ...washers
          .filter(
            w =>
              this.today.toDateString() === w.expectedResultDate.toDateString()
          )
          .map(w => ({ data: w, type: 'washer' })),
        ...scopes
          .filter(
            s =>
              this.today.toDateString() === s.expectedResultDate.toDateString()
          )
          .map(s => ({ data: s, type: 'scope' })),
      ] as Notification[]
    })
  }

  onHideProfileDropDown() {
    this.hideProfileDropDown = !this.hideProfileDropDown
  }

  onHideNotificationDropDown() {
    this.hideNotificationDropDown = !this.hideNotificationDropDown
  }

  async onLogout() {
    await this.authService.logout()
    this.router.navigate(['/'])
  }
}
