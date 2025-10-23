import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ravitaillement } from './ravitaillement';

describe('Ravitaillement', () => {
  let component: Ravitaillement;
  let fixture: ComponentFixture<Ravitaillement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ravitaillement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ravitaillement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
