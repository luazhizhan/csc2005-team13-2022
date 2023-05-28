import { Component } from '@angular/core'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-endoscope-label',
  templateUrl: './endoscope-label.component.html',
  styleUrls: ['./endoscope-label.component.css'],
})
export class EndoscopeLabelComponent {
  show = false

  faCircleQuestion = faCircleQuestion

  constructor() {}
}
