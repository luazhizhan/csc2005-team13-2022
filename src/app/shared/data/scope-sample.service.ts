import { Injectable } from '@angular/core'
import { addDays, subDays, subMonths } from 'date-fns'
import { BehaviorSubject, map, Observable } from 'rxjs'

type Awaiting = {
  id: string
  serialNo: string
  type: 'REGULAR' | 'LOAN' | 'REPAIR'
  sendDate: Date
  expectedResultDate: Date

  disinfectant: string
  disinfectantNo: string
  disinfectantChanged: Date

  detergent: string
  detergentLotNo: string
}

type Completed = {
  id: string
  serialNo: string
  type: 'REGULAR' | 'LOAN' | 'REPAIR'
  sendDate: Date
  expectedResultDate: Date

  resultDate: Date
  quarantineRequired: 'No' | 'Yes'
  repeatDate?: Date

  washedBy: string // User ID
  collectedBy: string // User ID
  circulatedBy: string // User ID

  disinfectant: string
  disinfectantNo: string
  disinfectantChanged: Date

  detergent: string
  detergentLotNo: string

  fluidResult: 'No Growth' | 'Growth Detacted'
  fluidComments?: string
  fluidAction?: 'Repeat' | 'Quarantine' | 'No Action'

  swabResult: 'No Growth' | 'Growth Detacted'
  swabComments?: string
  swabAction?: 'Repeat' | 'Quarantine' | 'No Action'

  dryer: 'Dryer 1' | 'Dryer 2' | 'Dryer 3'
  dryerLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7
  dryerRemarks?: string
}

type Result = Awaiting | Completed

@Injectable({
  providedIn: 'root',
})
export class ScopeSampleService {
  private id = '3'

  private data: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>([
    {
      id: '1',
      sendDate: subMonths(new Date(), 1),
      expectedResultDate: addDays(subMonths(new Date(), 1), 14),
      resultDate: addDays(subMonths(new Date(), 1), 14),
      serialNo: '2912702',
      type: 'REGULAR',
      washedBy: 'user1',
      collectedBy: 'user2',
      circulatedBy: 'user3',
      disinfectant: 'RAPICIDE PA PART A & B',
      disinfectantNo: 'A-506538, B-506539',
      disinfectantChanged: subMonths(new Date(), 3),
      detergent: 'INTERCEPT PLUS',
      detergentLotNo: '100000030',
      fluidResult: 'No Growth',
      fluidComments: undefined,
      fluidAction: undefined,
      swabResult: 'No Growth',
      swabComments: undefined,
      swabAction: undefined,
      quarantineRequired: 'No',
      repeatDate: undefined,
      dryer: 'Dryer 1',
      dryerLevel: 2,
      dryerRemarks: undefined,
    },
    {
      id: '2',
      sendDate: subDays(new Date(), 14),
      expectedResultDate: new Date(),
      serialNo: '2912702',
      type: 'REGULAR',
      disinfectant: 'RAPICIDE PA PART A & B',
      disinfectantNo: 'A-506538, B-506539',
      disinfectantChanged: subMonths(new Date(), 4),
      detergent: 'INTERCEPT PLUS',
      detergentLotNo: '100000030',
    },
  ])

  data$ = this.data.asObservable()

  constructor() {}

  getTitle(data: Result): string {
    return `Endoscope (${data.serialNo}) sample (${data.type}) result`
  }

  getAwaitingResultBySerialNo(serialNo: string): Awaiting | undefined {
    return this.data.value.find(
      sample => !('resultDate' in sample) && sample.serialNo === serialNo
    )
  }

  getAwaitingResults(): Observable<Awaiting[]> {
    return this.data$.pipe(
      map(samples => samples.filter(sample => !('resultDate' in sample)))
    )
  }

  addAwaitingResult(result: Awaiting): void {
    const updatedData = [
      ...this.data.value,
      { ...result, id: this.id, disinfectantChanged: subMonths(new Date(), 3) },
    ]
    this.id = (parseInt(this.id, 10) + 1).toString()
    this.data.next(updatedData)
  }

  updateResult(accessionNo: string, result: Result): void {
    const current = this.data.value
    const index = current.findIndex(l => l.id === accessionNo)
    current[index] = result
    this.data.next(current)
  }
}
