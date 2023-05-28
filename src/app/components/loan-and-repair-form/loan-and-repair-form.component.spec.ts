import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoanAndRepairFormComponent } from './loan-and-repair-form.component'

describe('LoanAndRepairFormComponent', () => {
  let component: LoanAndRepairFormComponent
  let fixture: ComponentFixture<LoanAndRepairFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoanAndRepairFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(LoanAndRepairFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
