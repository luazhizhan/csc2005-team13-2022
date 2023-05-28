import { ComponentFixture, TestBed } from '@angular/core/testing'

import { EndoscopeLabelComponent } from './endoscope-label.component'

describe('EndoscopeLabelComponent', () => {
  let component: EndoscopeLabelComponent
  let fixture: ComponentFixture<EndoscopeLabelComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EndoscopeLabelComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(EndoscopeLabelComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
