import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { differenceInHours, format } from 'date-fns'
import { AppointmentService } from '../../shared/data/appointment.service'
import { EndoscopeService } from '../../shared/data/endoscope.service'
import { UserService } from '../../shared/data/user.service'

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css'],
})
export class AppointmentFormComponent implements OnInit {
  faExclamationCircle = faExclamationCircle

  @Input() type: 'create' | 'update' = 'create'

  @Input() routeData: any

  title = this.type === 'create' ? 'Create appointment' : 'Update appointment'

  endoscope: any
  incharge: any
  users = this.userService.getUsers()
  endoscopes = this.endoscopeService.getEndoscopes()

  formError: string | undefined
  formSuccess: string | undefined
  submitText: string = 'Create'
  showDelete: boolean = false

  // Confirmation modal
  hideModal = true
  modalTitle = ''
  modalMessage = ''
  modalType: 'error' | 'info' = 'info'
  modalConfirmText = 'Confirm'

  formGroup = new FormGroup({
    incharge: new FormControl(undefined, Validators.required),
    patientName: new FormControl(undefined, Validators.required),
    endoscopeSerialNo: new FormControl(undefined, Validators.required),
    room: new FormControl(undefined, Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  })

  constructor(
    private router: Router,
    private userService: UserService,
    private endoscopeService: EndoscopeService,
    private appointmentService: AppointmentService
  ) {}
  ngOnInit(): void {
    if (this.type === 'create') {
      if (this.routeData !== undefined) {
        this.formGroup.patchValue({
          endoscopeSerialNo: this.routeData.serialNo,
          startDate: format(
            new Date(this.routeData.selectedDate),
            "yyyy-MM-dd'T'HH:mm"
          ),
        })
      } else {
        this.formGroup.controls.startDate.setValue(
          format(new Date(), "yyyy-MM-dd'T'HH:mm")
        )
      }

      this.submitText = 'Create'
    } else {
      if (this.routeData !== undefined) {
        this.incharge = this.userService.getUserById(this.routeData.incharge)
        this.endoscope = this.endoscopeService.getEndoscopeBySerialNo(
          this.routeData.serialNo
        )

        this.formGroup.patchValue({
          incharge: this.routeData.incharge,
          patientName: this.routeData.patientName,
          endoscopeSerialNo: this.routeData.endoscopeSerialNo,
          room: this.routeData.room,
          startDate: format(
            new Date(this.routeData.startDate),
            "yyyy-MM-dd'T'HH:mm"
          ),
          endDate: format(
            new Date(this.routeData.endDate),
            "yyyy-MM-dd'T'HH:mm"
          ),
        })
      }

      this.submitText = 'Update'
    }
  }

  onDelete() {
    this.showDelete = false
    this.formError = undefined
    this.formSuccess = 'Deleting...'
    this.appointmentService.deleteAppointment(this.routeData)

    this.formSuccess =
      'Appointment has been deleted. You will be redirected shortly...'
    this.submitText = 'Redirecting...'
    setTimeout(() => {
      this.router.navigate(['/dashboard'])
    }, 3000)
  }

  onSubmitCancel() {
    this.modalTitle = ''
    this.modalConfirmText = ''
    this.modalMessage = ''
    this.hideModal = true
  }

  onSubmitConfirm() {
    this.onSubmitCancel()

    const {
      incharge,
      endDate,
      endoscopeSerialNo,
      patientName,
      room,
      startDate,
    } = this.formGroup.value

    if (this.type === 'update') {
      this.appointmentService.updateAppointment({
        ...this.routeData,
        incharge,
        endDate: new Date(endDate as string),
        endoscopeSerialNo,
        patientName,
        room,
        startDate: new Date(startDate as string),
      })
      this.formSuccess =
        'Appointment has been updated. You will be redirected shortly...'
    } else {
      this.appointmentService.addAppointment({
        incharge,
        endDate: new Date(endDate as string),
        endoscopeSerialNo,
        patientName,
        room,
        startDate: new Date(startDate as string),
      } as any)
      this.formSuccess =
        'Appointment has been created. You will be redirected shortly...'
    }

    this.submitText = 'Redirecting...'
    setTimeout(() => {
      this.router.navigate(['/dashboard'])
    }, 3000)
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formError = 'Please fill in all required fields'
      return
    }
    const { endDate, startDate } = this.formGroup.value

    if (new Date() > new Date(startDate as string)) {
      this.formError = 'Start date cannot be in the past'
      return
    }

    if (
      differenceInHours(
        new Date(endDate as string),
        new Date(startDate as string)
      ) < 1
    ) {
      this.formError = 'End date must at least 1hr later than start date'
      return
    }

    this.formError = undefined
    this.formSuccess = undefined

    if (this.type === 'update') {
      this.modalTitle = 'Confirm update'
      this.modalMessage = 'Are you sure you want to update this appointment?'
      this.modalConfirmText = 'Update'
    } else {
      this.modalTitle = 'Confirm create'
      this.modalMessage = 'Are you sure you want to create this appointment?'
      this.modalConfirmText = 'Create'
    }
    this.modalType = 'info'
    this.hideModal = false
  }
}
