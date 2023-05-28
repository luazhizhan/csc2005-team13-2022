import { Component, OnInit } from '@angular/core'
import { faSink, faStethoscope } from '@fortawesome/free-solid-svg-icons'
import { Endoscope, EndoscopeService } from '../shared/data/endoscope.service'
import { Loan, LoanService } from '../shared/data/loan.service'
import { Repair, RepairService } from '../shared/data/repair.service'
import { Washer, WasherService } from '../shared/data/washer.service'

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})
export class EquipmentComponent implements OnInit {
  faStethoscope = faStethoscope
  faSink = faSink

  bronchoscopes: Endoscope[] = []
  ogds: Endoscope[] = []

  endoscopes: Endoscope[] = []
  washers: Washer[] = []
  repairs: Repair[] = []
  loans: Loan[] = []
  totalScope: number = 0
  currScope: number = 0
  totalWasher: number = 0
  currWasher: number = 0

  constructor(
    private endoscopeService: EndoscopeService,
    private washerService: WasherService,
    private repairService: RepairService,
    private loanService: LoanService
  ) {}

  ngOnInit(): void {
    this.endoscopes = this.endoscopeService.getEndoscopes()
    this.bronchoscopes = this.endoscopes.filter(e => e.type == 'BRONCHOSCOPE')
    this.ogds = this.endoscopes.filter(e => e.type == 'OGD')

    this.washers = this.washerService.getWashers()
    this.repairService
      .getUnreturnedRepairs()
      .subscribe((repairs: Repair[]) => (this.repairs = repairs))

    this.loanService
      .getUnreturnsLoans()
      .subscribe((loans: Loan[]) => (this.loans = loans))

    this.totalScope = this.endoscopes.length
    this.totalWasher = this.washers.length
    this.scopeAvail()
    this.washerAvail()
  }

  scopeAvail() {
    this.currScope = this.totalScope
    this.endoscopes.forEach(scope => {
      if (
        this.repairService.getUnreturnedRepairBySerialNo(scope.serialNo) != null
      )
        this.currScope -= 1

      if (this.loanService.getUnreturnedLoanBySerialNo(scope.serialNo) != null)
        this.currScope -= 1
    })
  }

  washerAvail() {
    this.currWasher = this.totalWasher
    this.washers.forEach(washer => {
      if (
        this.repairService.getUnreturnedRepairBySerialNo(washer.serialNo) !=
        null
      )
        this.currWasher -= 1
    })
  }

  status(serialNo: string): string {
    let currStatus = 'Available'
    if (this.repairService.getUnreturnedRepairBySerialNo(serialNo) != null)
      currStatus = 'Repair'

    if (this.loanService.getUnreturnedLoanBySerialNo(serialNo) != null)
      currStatus = 'Loan'

    return currStatus
  }
}
