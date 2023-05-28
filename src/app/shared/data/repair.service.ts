import { Injectable } from '@angular/core'
import { subMonths } from 'date-fns'
import { BehaviorSubject, map, Observable } from 'rxjs'

export type Repair = {
  id: string
  incharge: string
  serialNo: string
  date: Date
  expectedDate: Date
  remarks?: string
  returnDate?: Date
}

@Injectable({
  providedIn: 'root',
})
export class RepairService {
  private id = '2'

  private data: BehaviorSubject<Repair[]> = new BehaviorSubject<Repair[]>([
    {
      id: '1',
      incharge: 'user1',
      serialNo: '2912704',
      date: subMonths(new Date(), 1),
      expectedDate: new Date(),
      remarks: 'Repair for a month',
    },
  ])

  data$ = this.data.asObservable()

  constructor() {}

  getTitle(repair: Repair): string {
    return `Repair return for endoscope (${repair.serialNo})`
  }

  getUnreturnedRepairs(): Observable<Repair[]> {
    return this.data$.pipe(map(repairs => repairs.filter(r => !r.returnDate)))
  }

  getUnreturnedRepairBySerialNo(serialNo: string): Repair | undefined {
    return this.data.value.find(
      repair => !repair.returnDate && repair.serialNo === serialNo
    )
  }

  addRepair(repair: Repair) {
    const updatedData = [...this.data.value, { ...repair, id: this.id }]
    this.id = (parseInt(this.id) + 1).toString()
    this.data.next(updatedData)
  }

  updateRepair(repair: Repair) {
    const current = this.data.value
    const index = current.findIndex(l => l.id === repair.id)
    current[index] = repair
    this.data.next(current)
  }
}
