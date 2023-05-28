import { Injectable } from '@angular/core'
import { addDays, format, setHours } from 'date-fns'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { User, UserService } from './user.service'

type Appointment = {
  id: string
  incharge: string
  patientName: string
  endoscopeSerialNo: string
  room: string
  startDate: Date
  endDate: Date
}
@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private id = '4'

  private data: BehaviorSubject<Appointment[]> = new BehaviorSubject<
    Appointment[]
  >([
    {
      id: '1',
      incharge: 'user1',
      patientName: 'Sally',
      endoscopeSerialNo: '5G403K183',
      room: '1A',
      startDate: setHours(new Date(), 13),
      endDate: setHours(new Date(), 14),
    },
    {
      id: '2',
      incharge: 'user2',
      patientName: 'Alice',
      endoscopeSerialNo: '5G403K183',
      room: '1B',
      startDate: addDays(setHours(new Date(), 13), 1),
      endDate: addDays(setHours(new Date(), 14), 1),
    },
    {
      id: '3',
      incharge: 'user1',
      patientName: 'Tim',
      endoscopeSerialNo: '5G403K184',
      room: '1C',
      startDate: addDays(setHours(new Date(), 13), 3),
      endDate: addDays(setHours(new Date(), 14), 3),
    },
  ])

  data$ = this.data.asObservable()

  constructor(private userService: UserService) {}

  getTitle(appointment: Appointment) {
    const user = this.userService.getUserById(appointment.incharge) as User
    return `${user.firstname} ${user.lastname} - (${appointment.patientName}) - ${appointment.room} - ${appointment.endoscopeSerialNo}`
  }

  getDescription(logonUser: User, appointment: Appointment) {
    const user = this.userService.getUserById(appointment.incharge) as User
    const name =
      user.id === logonUser.id ? 'You have' : `Nurse ${user.firstname} has`
    return `${name} an appointment with ${appointment.patientName} at ${format(
      appointment.startDate,
      'h:mm a'
    )} room ${appointment.room}`
  }

  getAppointmentsByIncharge(incharge: string): Observable<Appointment[]> {
    return this.data$.pipe(
      map(appointments =>
        appointments.filter(appointment => appointment.incharge === incharge)
      )
    )
  }

  getAppointmentByEndoscopeSerialNoAndDate(
    endoscopeSerialNo: string,
    date: Date
  ): Appointment | undefined {
    return this.data.value.find(
      appointment =>
        appointment.endoscopeSerialNo === endoscopeSerialNo &&
        appointment.startDate.toDateString() === date.toDateString()
    )
  }

  getAppointmentsByDateAndIncharge(
    date: Date,
    incharge: string
  ): Observable<Appointment[]> {
    return this.data$.pipe(
      map(data =>
        data.filter(
          appointment =>
            appointment.startDate.toDateString() === date.toDateString() &&
            appointment.incharge === incharge
        )
      )
    )
  }

  addAppointment(appointment: Appointment) {
    const updatedData = [...this.data.value, { ...appointment, id: this.id }]
    this.id = (parseInt(this.id) + 1).toString()
    this.data.next(updatedData)
  }

  deleteAppointment(appointment: Appointment) {
    this.data.next(this.data.value.filter(item => item.id !== appointment.id))
  }

  updateAppointment(appointment: Appointment) {
    const current = this.data.value
    const index = current.findIndex(l => l.id === appointment.id)
    current[index] = appointment
    this.data.next(current)
  }
}
