import { Injectable } from '@angular/core'

export type Washer = {
  label: string
  modelNo: string
  serialNo: string
  frequency: number
}

@Injectable({
  providedIn: 'root',
})
export class WasherService {
  private data: Washer[] = [
    {
      label: 'Washer A',
      modelNo: 'MEDIVATOR 1A',
      serialNo: '13104354',
      frequency: 4,
    },
    {
      label: 'Washer B',
      modelNo: 'MEDIVATOR 1A',
      serialNo: '13104355',
      frequency: 4,
    },
    {
      label: 'Washer C',
      modelNo: 'MEDIVATOR 1A',
      serialNo: '13104356',
      frequency: 4,
    },
    {
      label: 'Washer D',
      modelNo: 'MEDIVATOR 1A',
      serialNo: '13104357',
      frequency: 4,
    },
  ]

  getWasherBySerialNo(serialNo: string): Washer | undefined {
    return this.data.find(washer => washer.serialNo === serialNo)
  }

  getWashers(): Washer[] {
    return this.data
  }
}
