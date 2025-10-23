import { TestBed } from '@angular/core/testing';

import { Ravitaillement } from './ravitaillement';

describe('Ravitaillement', () => {
  let service: Ravitaillement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ravitaillement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
