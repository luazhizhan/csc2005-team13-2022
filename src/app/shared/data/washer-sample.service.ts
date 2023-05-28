import { Injectable } from '@angular/core'
import { addDays, subDays, subMonths } from 'date-fns'
import { BehaviorSubject, map, Observable } from 'rxjs'

type Awaiting = {
  id: string
  serialNo: string
  sendDate: Date
  expectedResultDate: Date

  disinfectant: string
  disinfectantNo: string
  disinfectantChanged: Date

  detergent: string
  detergentLotNo: string

  filterChangeDate: Date
}

type Completed = {
  id: string
  serialNo: string
  sendDate: Date
  expectedResultDate: Date

  resultDate: Date
  quarantineRequired: 'No' | 'Yes'
  repeatDate?: Date
  remarks?: string

  collectedBy: string
  circulatedBy: string

  disinfectant: string
  disinfectantNo: string
  disinfectantChanged: Date

  detergent: string
  detergentLotNo: string

  filterChangeDate: Date

  fluidResult: 'No Growth' | 'Growth Detacted'
  analysis?: string
  actionTaken?: string
}

type Result = Awaiting | Completed

@Injectable({
  providedIn: 'root',
})
export class WasherSampleService {
  private id = '3'

  private data: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>([
    {
      id: '1',
      sendDate: subMonths(new Date(), 1),
      expectedResultDate: addDays(subMonths(new Date(), 1), 14),
      resultDate: addDays(subMonths(new Date(), 1), 14),
      serialNo: '13104354',
      collectedBy: 'user1',
      circulatedBy: 'user3',
      disinfectant: 'RAPICIDE PA PART A & B',
      disinfectantNo: 'A-506538, B-506539',
      disinfectantChanged: subMonths(new Date(), 3),
      detergent: 'INTERCEPT PLUS',
      detergentLotNo: '100000030',
      filterChangeDate: subMonths(new Date(), 4),
      fluidResult: 'No Growth',
      analysis: undefined,
      actionTaken: undefined,
      quarantineRequired: 'No',
      repeatDate: undefined,
      remarks: 'FINAL RINSE PROGRAMME',
    },
    {
      id: '2',
      sendDate: subDays(new Date(), 15),
      expectedResultDate: addDays(new Date(), 1),
      serialNo: '13104354',
      disinfectant: 'RAPICIDE PA PART A & B',
      disinfectantNo: 'A-506538, B-506539',
      disinfectantChanged: subMonths(new Date(), 4),
      detergent: 'INTERCEPT PLUS',
      detergentLotNo: '100000030',
      filterChangeDate: subMonths(new Date(), 5),
    },
  ])

  data$ = this.data.asObservable()

  getTitle(data: Result): string {
    return `Washer (${data.serialNo}) sample result`
  }

  getAwaitingResults(): Observable<Awaiting[]> {
    return this.data$.pipe(
      map(samples => samples.filter(item => !('resultDate' in item)))
    )
  }

  getAwaitingResultBySerialNo(serialNo: string): Awaiting | undefined {
    return this.data.value.find(
      sample => !('resultDate' in sample) && sample.serialNo === serialNo
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
