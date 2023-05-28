import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CreateSampleFormComponent } from './create-sample-form.component'

describe('CreateSampleFormComponent', () => {
  let component: CreateSampleFormComponent
  let fixture: ComponentFixture<CreateSampleFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSampleFormComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CreateSampleFormComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
