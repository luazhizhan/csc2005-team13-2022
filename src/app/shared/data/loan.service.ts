import { Injectable } from '@angular/core'
import { subMonths } from 'date-fns'
import { BehaviorSubject, map, Observable } from 'rxjs'

export type Loan = {
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
export class LoanService {
  private id = '2'

  private data: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([
    {
      id: '1',
      incharge: 'user1',
      serialNo: '2912703',
      date: subMonths(new Date(), 1),
      expectedDate: new Date(),
      remarks: 'Loan for 1 month',
    },
  ])

  data$ = this.data.asObservable()

  getTitle(loan: Loan): string {
    return `Loan return for endoscope (${loan.serialNo})`
  }

  getUnreturnsLoans(): Observable<Loan[]> {
    return this.data$.pipe(map(loans => loans.filter(l => !l.returnDate)))
  }

  getUnreturnedLoanBySerialNo(serialNo: string): Loan | undefined {
    return this.data.value.find(
      loan => !loan.returnDate && loan.serialNo === serialNo
    )
  }

  addLoan(loan: Loan) {
    const updatedData = [...this.data.value, { ...loan, id: this.id }]
    this.id = (parseInt(this.id, 10) + 1).toString()
    this.data.next(updatedData)
  }

  updateLoan(loan: Loan) {
    const current = this.data.value
    const index = current.findIndex(l => l.id === loan.id)
    current[index] = loan
    this.data.next(current)
  }
}
