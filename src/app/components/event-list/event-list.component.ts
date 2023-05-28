import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import {
  faCalendarCheck,
  faFlask,
  faHandHolding,
  faToolbox,
} from '@fortawesome/free-solid-svg-icons'
import { EndoscopeService } from 'src/app/shared/data/endoscope.service'
import { WasherService } from 'src/app/shared/data/washer.service'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
})
export class EventListComponent {
  faFlask = faFlask
  faHandHolding = faHandHolding
  faCalendarCheck = faCalendarCheck
  faToolbox = faToolbox

  @Input() events: any

  constructor(
    private router: Router,
    public endoscopeService: EndoscopeService,
    public washerService: WasherService
  ) {}

  eventClick(e: any) {
    // route to form page with selected event data
    this.router.navigate([
      'form',
      {
        type: `update-${e.type}`,
        data: JSON.stringify(e.data),
      },
    ])
  }
}
