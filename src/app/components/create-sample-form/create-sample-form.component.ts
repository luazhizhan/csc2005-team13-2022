import { formatDate } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { addWeeks } from 'date-fns'
import { EndoscopeService } from 'src/app/shared/data/endoscope.service'
import { ScopeSampleService } from 'src/app/shared/data/scope-sample.service'
import { WasherSampleService } from 'src/app/shared/data/washer-sample.service'
import { WasherService } from 'src/app/shared/data/washer.service'

@Component({
  selector: 'app-create-sample-form',
  templateUrl: './create-sample-form.component.html',
  styleUrls: ['./create-sample-form.component.css'],
})
export class CreateSampleFormComponent implements OnInit {
  @Input() type: 'scope' | 'washer' | undefined
  @Input() routeData: any

  title: any

  washers = this.washerService.getWashers()
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

  formGroup = new FormGroup<any>({
    serialNo: new FormControl(undefined, Validators.required),
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
    private scopeSampleService: ScopeSampleService,

    private washerService: WasherService,
    private endoscopeService: EndoscopeService,
    private washerSampleService: WasherSampleService
  ) {}

  ngOnInit(): void {
    if (this.routeData) {
      const date = new Date(this.routeData.selectedDate)
      this.formGroup.patchValue({
        serialNo: this.routeData.serialNo,
        sendDate: formatDate(date, 'yyyy-MM-dd', 'en'),
        expectedResultDate: formatDate(addWeeks(date, 2), 'yyyy-MM-dd', 'en'),
      })
    }

    if (this.type === 'scope') {
      this.title = 'Create endoscope sampling form'
      this.formGroup.addControl(
        'type',
        new FormControl(undefined, Validators.required)
      )
    } else {
      this.title = 'Create washer sampling form'
    }
  }

  onSubmitConfirm() {
    this.onSubmitCancel()
    const {
      serialNo,
      sendDate,
      expectedResultDate,
      disinfection,
      disinfectantNo,
      detergent,
      detergentLotNo,
    } = this.formGroup.value

    this.submitText = 'Creating...'
    if (this.type === 'scope') {
      const type = this.formGroup.value.type
      this.scopeSampleService.addAwaitingResult({
        id: '1',
        serialNo,
        sendDate: new Date(sendDate as string),
        expectedResultDate: new Date(expectedResultDate as string),
        type,
        disinfectant: disinfection,
        disinfectantNo,
        detergent,
        detergentLotNo,
      } as any)

      this.formSuccess =
        'Endoscope sampling has been created. You will be redirected shortly...'
    } else {
      this.washerSampleService.addAwaitingResult({
        id: '1',
        serialNo,
        sendDate: new Date(sendDate as string),
        expectedResultDate: new Date(expectedResultDate as string),
        disinfectant: disinfection,
        disinfectantNo,
        detergent,
        detergentLotNo,
      } as any)

      this.formSuccess =
        'Washer sampling has been created. You will be redirected shortly...'
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
    const { sendDate, expectedResultDate } = this.formGroup.value

    if (new Date(this.today) > new Date(sendDate as string)) {
      this.formError = 'Send date cannot be in the past'
      return
    }
    if (
      new Date(sendDate as string) >= new Date(expectedResultDate as string)
    ) {
      this.formError = 'Expected date must later than send date'
      return
    }

    this.formError = undefined
    this.formSuccess = undefined

    if (this.type === 'scope') {
      this.modalMessage =
        'Are you sure you want to create this endoscope sample?'
    } else {
      this.modalMessage = 'Are you sure you want to create this washer sample?'
    }
    this.modalTitle = 'Confirm create'
    this.modalConfirmText = 'Create'
    this.modalType = 'info'
    this.hideModal = false
  }
}
