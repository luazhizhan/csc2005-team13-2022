import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  faCalendarCheck,
  faDroplet,
  faFlask,
  faHandHolding,
  faKitMedical,
  faRightLeft,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons'
import { CalendarEvent, CalendarView } from 'angular-calendar'
import { differenceInDays } from 'date-fns'
import { combineLatest, Subject } from 'rxjs'
import { AuthService } from '../shared/auth.service'
import { AppointmentService } from '../shared/data/appointment.service'
import { Endoscope, EndoscopeService } from '../shared/data/endoscope.service'
import { LoanService } from '../shared/data/loan.service'
import { RepairService } from '../shared/data/repair.service'
import { ScopeSampleService } from '../shared/data/scope-sample.service'
import { WasherSampleService } from '../shared/data/washer-sample.service'
import { Washer, WasherService } from '../shared/data/washer.service'
import { LocalService } from '../shared/local.service'

const colors = {
  appointment: {
    primary: '#0e7490',
    secondary: '#0e7490',
    secondaryText: '#ffffff',
  },
  sample: {
    primary: '#c2410c',
    secondary: '#c2410c',
    secondaryText: '#ffffff',
  },
  repair: {
    primary: '#a21caf',
    secondary: '#a21caf',
    secondaryText: '#ffffff',
  },
  loan: {
    primary: '#4338ca',
    secondary: '#4338ca',
    secondaryText: '#ffffff',
  },
}

type CreateFormEvent = 'appointment' | 'washer' | 'scope' | 'repair' | 'loan'

type SelectedEvent = {
  type: 'loan' | 'repair' | 'washer' | 'scope' | 'appointment'
  data: any
}

type SelectedEndoscope = {
  data: Endoscope
  event?: {
    type: 'appointment' | 'loan' | 'repair' | 'scope'
    data: any
    description: string
  }
}

type SelectedWasher = {
  data: Washer
  event?: {
    type: 'washer'
    data: any
    description: string
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Icons
  faFlask = faFlask
  faCalendarCheck = faCalendarCheck
  faHandHolding = faHandHolding
  faToolbox = faToolbox
  faRightLeft = faRightLeft
  faKitMedical = faKitMedical
  faDroplet = faDroplet

  // Properties
  CalendarView = CalendarView
  view: CalendarView = CalendarView.Week

  viewDate: Date = new Date()
  refresh = new Subject<void>()
  user = this.authService.getCurrentUser()
  events: CalendarEvent[] = []

  // Selected date properties
  selectedDate: Date | undefined

  selectedEvents: SelectedEvent[] = []

  selectedEndoscopes: SelectedEndoscope[] = []
  selectedEndoscope: SelectedEndoscope | undefined

  selectedWashers: SelectedWasher[] = []
  selectedWasher: SelectedWasher | undefined

  // Selected datetime
  selectedDateTime: Date | undefined

  constructor(
    private washerService: WasherService,
    private endoscopeService: EndoscopeService,
    private authService: AuthService,
    private loanService: LoanService,
    private repairService: RepairService,
    private scopeSampleService: ScopeSampleService,
    private washerSampleService: WasherSampleService,
    private appointmentService: AppointmentService,
    private localService: LocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const calendarView = this.localService.getData('view')
    if (calendarView === 'Month') {
      this.view = CalendarView.Month
    } else if (calendarView === 'Week') {
      this.view = CalendarView.Week
    }

    const loans$ = this.loanService.getUnreturnsLoans()
    const repairs$ = this.repairService.getUnreturnedRepairs()
    const washers$ = this.washerSampleService.getAwaitingResults()
    const scopes$ = this.scopeSampleService.getAwaitingResults()
    const appointments$ = this.appointmentService.getAppointmentsByIncharge(
      this.user.id
    )

    combineLatest([
      loans$,
      repairs$,
      washers$,
      scopes$,
      appointments$,
    ]).subscribe(([loans, repairs, washers, scopes, appointments]) => {
      this.events = [
        ...loans.map(loan => {
          return {
            meta: { data: loan, type: 'loan' },
            title: this.loanService.getTitle(loan),
            start: loan.expectedDate,
            end: loan.expectedDate,
            color: colors.loan,
            allDay: true,
          }
        }),
        ...repairs.map(repair => {
          return {
            meta: { data: repair, type: 'repair' },
            title: this.repairService.getTitle(repair),
            start: repair.expectedDate,
            end: repair.expectedDate,
            color: colors.repair,
            allDay: true,
          }
        }),
        ...washers.map(washer => {
          return {
            meta: { data: washer, type: 'washer' },
            title: this.washerSampleService.getTitle(washer),
            start: washer.expectedResultDate,
            end: washer.expectedResultDate,
            color: colors.sample,
            allDay: true,
          }
        }),
        ...scopes.map(scope => {
          return {
            meta: { data: scope, type: 'scope' },
            title: this.scopeSampleService.getTitle(scope),
            start: scope.expectedResultDate,
            end: scope.expectedResultDate,
            color: colors.sample,
            allDay: true,
          }
        }),
        ...appointments.map(appointment => {
          return {
            meta: { data: appointment, type: 'appointment' },
            title: this.appointmentService.getTitle(appointment),
            start: appointment.startDate,
            end: appointment.endDate,
            color: colors.appointment,
            allDay: false,
          }
        }),
      ]
    })
  }

  onCalendarViewChange() {
    if (this.view === CalendarView.Month) {
      this.view = CalendarView.Week
      this.localService.saveData('view', 'Week')
    } else {
      this.view = CalendarView.Month
      this.localService.saveData('view', 'Month')
    }
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    this.selectedDate = date
    this.selectedEvents = events.map(event => event.meta)

    this.selectedWashers = this.washerService.getWashers().map(washer => {
      const { serialNo } = washer
      const washerSample =
        this.washerSampleService.getAwaitingResultBySerialNo(serialNo)

      return {
        data: washer,
        event: washerSample
          ? {
              type: 'washer',
              data: washerSample,
              description: 'Awaiting sampling result',
            }
          : undefined,
      }
    })

    this.selectedEndoscopes = this.endoscopeService
      .getEndoscopes()
      .map(endoscope => {
        const { serialNo } = endoscope
        const appointment =
          this.appointmentService.getAppointmentByEndoscopeSerialNoAndDate(
            serialNo,
            date
          )
        const loan = this.loanService.getUnreturnedLoanBySerialNo(serialNo)
        const repair =
          this.repairService.getUnreturnedRepairBySerialNo(serialNo)
        const scopeSample =
          this.scopeSampleService.getAwaitingResultBySerialNo(serialNo)

        return {
          data: endoscope,
          event: appointment
            ? {
                type: 'appointment',
                data: appointment,
                description: this.appointmentService.getDescription(
                  this.user,
                  appointment
                ),
              }
            : loan
            ? { type: 'loan', data: loan, description: 'Loan out' }
            : repair
            ? { type: 'repair', data: repair, description: 'Send for repair' }
            : scopeSample
            ? {
                type: 'scope',
                data: scopeSample,
                description: 'Awaiting sampling result',
              }
            : undefined,
        }
      })
  }

  onWasherClick(e: SelectedWasher) {
    if (this.selectedWasher === undefined) {
      this.selectedWasher = e
    } else if (this.selectedWasher.data.serialNo === e.data.serialNo) {
      this.selectedWasher = undefined
    } else {
      this.selectedWasher = e
    }
  }

  onEndoscopeClick(e: SelectedEndoscope) {
    if (this.selectedEndoscope === undefined) {
      this.selectedEndoscope = e
    } else if (this.selectedEndoscope.data.serialNo === e.data.serialNo) {
      this.selectedEndoscope = undefined
    } else {
      this.selectedEndoscope = e
    }
  }

  onUnavailableSelectedEndoscopeClick(e: SelectedEndoscope) {
    // route to form page with selected endoscope data
    this.router.navigate([
      'form',
      {
        type: `update-${e.event?.type}`,
        data: JSON.stringify(e.event?.data),
      },
    ])
  }

  hourSegmentClicked(date: Date) {
    this.selectedDateTime = date
  }

  onAvailableSelectedEndoscopeClick(type: string, e: SelectedEndoscope) {
    const date =
      differenceInDays(this.selectedDate as Date, new Date()) >= 0
        ? this.selectedDate
        : new Date()
    this.router.navigate([
      'form',
      {
        type: `create-${type}`,
        data: JSON.stringify({ ...e.data, selectedDate: date }),
      },
    ])
  }

  onUnavailableSelectedWasherClick(e: SelectedWasher) {
    // route to form page with selected washer data
    this.router.navigate([
      'form',
      {
        type: `update-${e.event?.type}`,
        data: JSON.stringify(e.event?.data),
      },
    ])
  }

  onAvailableSelectedWasherClick(e: SelectedWasher) {
    const date =
      differenceInDays(this.selectedDate as Date, new Date()) >= 0
        ? this.selectedDate
        : new Date()
    this.router.navigate([
      'form',
      {
        type: 'create-washer',
        data: JSON.stringify({ ...e.data, selectedDate: date }),
      },
    ])
  }

  closeModal() {
    this.selectedDate = undefined
    this.selectedEvents = []
    this.selectedEndoscope = undefined
    this.selectedEndoscopes = []
    this.selectedWasher = undefined
    this.selectedWashers = []
    this.selectedDateTime = undefined
  }

  handleEvent(_: string, e: CalendarEvent): void {
    this.router.navigate([
      'form',
      {
        type: `update-${e.meta.type}`,
        data: JSON.stringify(e.meta.data),
      },
    ])
  }

  createFormClick(e: CreateFormEvent) {
    switch (e) {
      case 'appointment':
        this.router.navigate([
          'form',
          {
            type: 'create-appointment',
            data: JSON.stringify({ selectedDate: this.selectedDateTime }),
          },
        ])
        break
      case 'loan':
        this.router.navigate([
          'form',
          {
            type: 'create-loan',
            data: JSON.stringify({ selectedDate: this.selectedDateTime }),
          },
        ])
        break
      case 'repair':
        this.router.navigate([
          'form',
          {
            type: 'create-repair',
            data: JSON.stringify({ selectedDate: this.selectedDateTime }),
          },
        ])
        break
      case 'scope':
        this.router.navigate([
          'form',
          {
            type: 'create-scope',
            data: JSON.stringify({ selectedDate: this.selectedDateTime }),
          },
        ])
        break
      case 'washer':
        this.router.navigate([
          'form',
          {
            type: 'create-washer',
            data: JSON.stringify({ selectedDate: this.selectedDateTime }),
          },
        ])
        break
      default:
        break
    }
  }

  setView(view: CalendarView) {
    this.view = view
  }
}
