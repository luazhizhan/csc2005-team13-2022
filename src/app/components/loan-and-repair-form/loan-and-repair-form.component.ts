import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { addDays } from 'date-fns'
import { AuthService } from 'src/app/shared/auth.service'
import { EndoscopeService } from 'src/app/shared/data/endoscope.service'
import { LoanService } from 'src/app/shared/data/loan.service'
import { RepairService } from 'src/app/shared/data/repair.service'
import { UserService } from 'src/app/shared/data/user.service'

@Component({
  selector: 'app-loan-and-repair-form',
  templateUrl: './loan-and-repair-form.component.html',
  styleUrls: ['./loan-and-repair-form.component.css'],
})
export class LoanAndRepairFormComponent implements OnInit {
  @Input() type: any
  @Input() routeData: any

  title: any
  logonUser = this.authService.getCurrentUser()
  users = this.userService.getUsers()
  endoscopes = this.endoscopeService.getEndoscopes()
  today = formatDate(new Date(), 'yyyy-MM-dd', 'en')

  formError: string | undefined
  formSuccess: string | undefined
  submitText: string = 'Create'

  // Confirmation modal
  hideModal = true
  modalTitle = ''
  modalMessage = ''
  modalType: 'error' | 'info' = 'info'
  modalConfirmText = 'Confirm'

  formGroup = new FormGroup({
    incharge: new FormControl(this.logonUser.id, Validators.required),
    date: new FormControl(this.today, Validators.required),
    expectedDate: new FormControl(
      formatDate(addDays(new Date(), 1), 'yyyy-MM-dd', 'en'),
      Validators.required
    ),
    serialNo: new FormControl(undefined, Validators.required),
    remarks: new FormControl(''),
  })

  constructor(
    private router: Router,
    private userService: UserService,
    private endoscopeService: EndoscopeService,
    private authService: AuthService,
    private loanService: LoanService,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.title = this.type === 'loan' ? 'Create loan' : 'Create repair'
    if (this.routeData) {
      const date = new Date(this.routeData.selectedDate)
      this.formGroup.patchValue({
        serialNo: this.routeData.serialNo,
        date: formatDate(date, 'yyyy-MM-dd', 'en'),
        expectedDate: formatDate(addDays(date, 1), 'yyyy-MM-dd', 'en'),
      })
    }
  }

  onSubmitConfirm() {
    this.onSubmitCancel()

    const { expectedDate, incharge, remarks, date, serialNo } =
      this.formGroup.value

    this.submitText = 'Creating...'

    if (this.type === 'loan') {
      this.loanService.addLoan({
        id: '1',
        serialNo,
        incharge,
        remarks,
        date: new Date(date as string),
        expectedDate: new Date(expectedDate as string),
      } as any)

      this.formSuccess =
        'Loan has been created. You will be redirected shortly...'
    } else {
      this.repairService.addRepair({
        id: '1',
        serialNo,
        incharge,
        remarks,
        date: new Date(date as string),
        expectedDate: new Date(expectedDate as string),
      } as any)

      this.formSuccess =
        'Repair has been created. You will be redirected shortly...'
    }

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

  onSubmit() {
    if (this.formGroup.invalid) {
      this.formError = 'Please fill in all required fields'
      return
    }

    const { expectedDate, date } = this.formGroup.value

    if (new Date(this.today) > new Date(date as string)) {
      this.formError = 'Start date cannot be in the past'
      return
    }
    if (new Date(date as string) >= new Date(expectedDate as string)) {
      this.formError = 'End date must later than start date'
      return
    }

    this.formError = undefined
    this.formSuccess = undefined

    if (this.type === 'loan') {
      this.modalTitle = 'Create loan'
      this.modalMessage = 'Are you sure you want to create this loan?'
    } else {
      this.modalTitle = 'Create repair'
      this.modalMessage = 'Are you sure you want to create this repair?'
    }
    this.modalConfirmText = 'Create'
    this.modalType = 'info'
    this.hideModal = false
  }
}
