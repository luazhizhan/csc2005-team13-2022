import { formatDate } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import {
  faCalendarCheck,
  faDroplet,
  faFileCircleCheck,
  faFlask,
  faToolbox,
  faUserNurse,
  faVial,
  faWind,
} from '@fortawesome/free-solid-svg-icons'
import { addWeeks, subMonths } from 'date-fns'
import { AuthService } from '../shared/auth.service'
import { EndoscopeService } from '../shared/data/endoscope.service'
import { LoanService } from '../shared/data/loan.service'
import { RepairService } from '../shared/data/repair.service'
import { ScopeSampleService } from '../shared/data/scope-sample.service'
import { UserService } from '../shared/data/user.service'
import { WasherSampleService } from '../shared/data/washer-sample.service'
import { WasherService } from '../shared/data/washer.service'

type FormType =
  | 'create-loan'
  | 'update-loan'
  | 'create-repair'
  | 'update-repair'
  | 'create-washer' // sampling
  | 'update-washer' // sampling
  | 'create-scope' // sampling
  | 'update-scope' // sampling
  | 'create-appointment'
  | 'update-appointment'
  | undefined

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  faFlask = faFlask
  faDroplet = faDroplet
  faVial = faVial
  faUserNurse = faUserNurse
  faWind = faWind
  faFileCircleCheck = faFileCircleCheck
  faCalendarCheck = faCalendarCheck
  faToolbox = faToolbox

  // Properties
  logonUser = this.authService.getCurrentUser()
  formType: FormType
  routeData: any
  endoscope: any
  washer: any
  incharge: any
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

  updateScopeForm = new FormGroup({
    resultDate: new FormControl(this.today, Validators.required),
    repeatDate: new FormControl(undefined),
    quarantineRequired: new FormControl(undefined, Validators.required),

    washedBy: new FormControl(undefined, Validators.required),
    collectedBy: new FormControl(undefined, Validators.required),
    circulatedBy: new FormControl(undefined, Validators.required),

    dryer: new FormControl(undefined, Validators.required),
    dryerLevel: new FormControl(undefined, Validators.required),
    dryerRemarks: new FormControl(undefined),

    fluidResult: new FormControl(undefined, Validators.required),
    fluidComments: new FormControl(undefined),
    fluidAction: new FormControl(undefined),

    swabResult: new FormControl(undefined, Validators.required),
    swabComments: new FormControl(undefined),
    swabAction: new FormControl(undefined),
  })

  updateWasherForm = new FormGroup({
    resultDate: new FormControl(this.today, Validators.required),
    repeatDate: new FormControl(undefined),
    quarantineRequired: new FormControl(undefined, Validators.required),
    remarks: new FormControl(undefined),

    collectedBy: new FormControl(undefined, Validators.required),
    circulatedBy: new FormControl(undefined, Validators.required),

    fluidResult: new FormControl(undefined, Validators.required),
    analysis: new FormControl(undefined),
    actionTaken: new FormControl(undefined),
  })

  updateLoanForm = new FormGroup({
    returnDate: new FormControl(this.today, Validators.required),
    sendDate: new FormControl(this.today, Validators.required),
    expectedResultDate: new FormControl(
      formatDate(addWeeks(new Date(), 2), 'yyyy-MM-dd', 'en'),
      Validators.required
    ),
    disinfection: new FormControl(undefined, Validators.required),
    disinfectantNo: new FormControl(undefined, Validators.required),
    detergent: new FormControl(undefined, Validators.required),
    detergentLotNo: new FormControl(undefined, Validators.required),
  })

  updateRepairForm = new FormGroup({
    returnDate: new FormControl(this.today, Validators.required),
    sendDate: new FormControl(this.today, Validators.required),
    expectedResultDate: new FormControl(
      formatDate(addWeeks(new Date(), 2), 'yyyy-MM-dd', 'en'),
      Validators.required
    ),
    disinfection: new FormControl(undefined, Validators.required),
    disinfectantNo: new FormControl(undefined, Validators.required),
    detergent: new FormControl(undefined, Validators.required),
    detergentLotNo: new FormControl(undefined, Validators.required),
  })

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private endoscopeService: EndoscopeService,
    private washerService: WasherService,
    private userService: UserService,
    private scopeSampleService: ScopeSampleService,
    private washerSampleService: WasherSampleService,
    private loanService: LoanService,
    private repairService: RepairService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const formType = params.get('type')
      if (formType === null) {
        this.formType = undefined
        this.routeData = undefined
        this.updateLoanForm.reset()
        this.updateRepairForm.reset()
        this.updateScopeForm.reset()
        this.updateWasherForm.reset()
        return
      }
      this.formType = formType as FormType
      const routeData = params.get('data')
      // Invalid route without route data
      if (routeData === null) {
        this.router.navigate(['/'])
        return
      }

      this.routeData = JSON.parse(routeData)

      // Set user in charge
      if (
        this.formType === 'update-loan' ||
        this.formType === 'update-repair' ||
        this.formType === 'update-appointment'
      ) {
        this.incharge = this.userService.getUserById(this.routeData.incharge)
      }

      // Set endoscope
      if (
        this.formType === 'update-loan' ||
        this.formType === 'update-scope' ||
        this.formType === 'update-repair' ||
        this.formType === 'update-appointment'
      ) {
        this.endoscope = this.endoscopeService.getEndoscopeBySerialNo(
          this.routeData.serialNo
        )
      }

      // Set washer
      if (this.formType === 'update-washer') {
        this.washer = this.washerService.getWasherBySerialNo(
          this.routeData.serialNo
        )
      }

      // Set button text
      if (this.formType?.includes('update')) {
        this.submitText = 'Update'
      } else {
        this.submitText = 'Create'
      }
    })
  }

  showSelectForm() {
    if (this.formType === undefined) return true
    if (this.formType.includes('update') === false) return true
    return false
  }

  onSelectFormChange(e: any) {
    this.formType = e.target.value
  }

  onSubmitConfirm() {
    this.submitText = 'Updating...'
    switch (this.formType) {
      case 'update-scope': {
        const {
          resultDate,
          repeatDate,
          quarantineRequired,
          washedBy,
          collectedBy,
          circulatedBy,
          dryer,
          dryerLevel,
          dryerRemarks,
          fluidResult,
          fluidAction,
          fluidComments,
          swabResult,
          swabComments,
          swabAction,
        } = this.updateScopeForm.value
        this.scopeSampleService.updateResult(this.routeData.id, {
          ...this.routeData,

          resultDate: new Date(resultDate as string),
          repeatDate: repeatDate ? new Date(repeatDate) : undefined,
          quarantineRequired,
          washedBy,
          collectedBy,
          circulatedBy,
          dryer,
          dryerLevel,
          dryerRemarks,
          fluidResult,
          fluidAction,
          fluidComments,
          swabResult,
          swabComments,
          swabAction,
        })

        this.formSuccess =
          'Endoscope sampling result has been updated. You will be redirected shortly...'
        this.submitText = 'Redirecting...'
        setTimeout(() => {
          this.router.navigate(['/dashboard'])
        }, 3000)
        break
      }
      case 'update-washer': {
        const {
          resultDate,
          repeatDate,
          quarantineRequired,
          remarks,
          collectedBy,
          circulatedBy,
          fluidResult,
          actionTaken,
          analysis,
        } = this.updateWasherForm.value
        this.washerSampleService.updateResult(this.routeData.id, {
          ...this.routeData,
          resultDate: new Date(resultDate as string),
          repeatDate: repeatDate ? new Date(repeatDate) : undefined,
          quarantineRequired,
          remarks,
          collectedBy,
          circulatedBy,
          fluidResult,
          actionTaken,
          analysis,
        })

        this.formSuccess =
          'Washer sampling result has been updated. You will be redirected shortly...'
        this.submitText = 'Redirecting...'
        setTimeout(() => {
          this.router.navigate(['/dashboard'])
        }, 3000)
        break
      }
      case 'update-loan': {
        const {
          returnDate,
          sendDate,
          expectedResultDate,
          disinfection,
          disinfectantNo,
          detergent,
          detergentLotNo,
        } = this.updateLoanForm.value
        this.loanService.updateLoan({
          ...this.routeData,
          returnDate: new Date(returnDate as string),
        })
        this.scopeSampleService.addAwaitingResult({
          id: '1',
          type: 'LOAN',
          serialNo: this.endoscope.serialNo,
          sendDate: new Date(sendDate as string),
          expectedResultDate: new Date(expectedResultDate as string),
          disinfectantChanged: subMonths(new Date(), 4),
          disinfection,
          disinfectantNo,
          detergent,
          detergentLotNo,
        } as any)

        this.formSuccess =
          'Loan has been updated and endoscope sampling has been created. You will be redirected shortly...'
        this.submitText = 'Redirecting...'
        setTimeout(() => {
          this.router.navigate(['/dashboard'])
        }, 3000)
        break
      }
      case 'update-repair': {
        const {
          returnDate,
          sendDate,
          expectedResultDate,
          disinfection,
          disinfectantNo,
          detergent,
          detergentLotNo,
        } = this.updateRepairForm.value
        this.repairService.updateRepair({
          ...this.routeData,
          returnDate: new Date(returnDate as string),
        })
        this.scopeSampleService.addAwaitingResult({
          id: '1',
          type: 'REPAIR',
          serialNo: this.endoscope.serialNo,
          sendDate: new Date(sendDate as string),
          expectedResultDate: new Date(expectedResultDate as string),
          disinfectantChanged: subMonths(new Date(), 4),
          disinfection,
          disinfectantNo,
          detergent,
          detergentLotNo,
        } as any)

        this.formSuccess =
          'Repair has been updated and endoscope sampling has been created. You will be redirected shortly...'
        this.submitText = 'Redirecting...'
        setTimeout(() => {
          this.router.navigate(['/dashboard'])
        }, 3000)
        break
      }
      default: {
        return
      }
    }
    this.onSubmitCancel()
  }

  onSubmitCancel() {
    this.modalTitle = ''
    this.modalConfirmText = ''
    this.modalMessage = ''
    this.hideModal = true
  }

  onSubmit() {
    this.modalTitle = 'Update Confirmation'
    this.modalConfirmText = 'Update'

    switch (this.formType) {
      case 'update-scope': {
        if (this.updateScopeForm.invalid) {
          this.formError = 'Please fill in all required fields'
          return
        }
        this.formError = undefined
        this.formSuccess = undefined
        this.modalMessage =
          'Are you sure you want to update this endoscope sampling result?'
        break
      }
      case 'update-washer': {
        if (this.updateWasherForm.invalid) {
          this.formError = 'Please fill in all required fields'
          return
        }
        this.formError = undefined
        this.formSuccess = undefined
        this.modalMessage =
          'Are you sure you want to update this washer sampling result?'
        break
      }
      case 'update-loan': {
        if (this.updateLoanForm.invalid) {
          this.formError = 'Please fill in all required fields'
          return
        }
        this.formError = undefined
        this.formSuccess = undefined
        this.modalMessage =
          'Are you sure you want to update this loan and create a new endoscope sampling result?'
        break
      }
      case 'update-repair': {
        if (this.updateRepairForm.invalid) {
          this.formError = 'Please fill in all required fields'
          return
        }
        this.formError = undefined
        this.formSuccess = undefined
        this.modalMessage =
          'Are you sure you want to update this repair record?'
        break
      }
    }
    this.hideModal = false
  }
}
