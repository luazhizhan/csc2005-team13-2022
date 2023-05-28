import { Injectable } from '@angular/core'

export type Endoscope = {
  label: string
  modelNo: string
  serialNo: string
  brand: string
  type: 'BRONCHOSCOPE' | 'OGD'
  frequency: number
}

@Injectable({
  providedIn: 'root',
})
export class EndoscopeService {
  private data: Endoscope[] = [
    {
      label: 'Scope A',
      modelNo: 'BF-P-190-(602)',
      serialNo: '2912702',
      brand: 'OLYMPLUS',
      type: 'BRONCHOSCOPE',
      frequency: 6,
    },
    {
      label: 'Scope B',
      modelNo: 'BF-P-200-(600)',
      serialNo: '2912703',
      brand: 'OLYMPLUS',
      type: 'BRONCHOSCOPE',
      frequency: 6,
    },
    {
      label: 'Scope C',
      modelNo: 'BF-P-200-(600)',
      serialNo: '2912704',
      brand: 'OLYMPLUS',
      type: 'BRONCHOSCOPE',
      frequency: 6,
    },
    {
      label: 'Scope D',
      modelNo: 'EG-760-Z-(361)',
      serialNo: '5G403K183',
      brand: 'FUJINON OGD',
      type: 'OGD',
      frequency: 7,
    },
    {
      label: 'Scope E',
      modelNo: 'EG-760-Z-(361)',
      serialNo: '5G403K184',
      brand: 'FUJINON OGD',
      type: 'OGD',
      frequency: 7,
    },
  ]

  constructor() {}

  getEndoscopeBySerialNo(serialNo: string): Endoscope | undefined {
    return this.data.find(endoscope => endoscope.serialNo === serialNo)
  }

  getEndoscopes(): Endoscope[] {
    return this.data
  }
}
