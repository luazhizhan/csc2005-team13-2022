import { Component, EventEmitter, Input, Output } from '@angular/core'
import {
  faCircleInfo,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  faCircleInfo = faCircleInfo
  faTriangleExclamation = faTriangleExclamation
  @Input() title: string = 'Modal Title'
  @Input() message: string = 'Modal Message'
  @Input() type: 'error' | 'info' = 'info'
  @Input() hideModal = true
  @Input() confirmText = 'Confirm'

  @Output() confirm = new EventEmitter()
  @Output() cancel = new EventEmitter()

  constructor() {}
}
