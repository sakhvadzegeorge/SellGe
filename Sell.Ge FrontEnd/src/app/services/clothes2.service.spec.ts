import { TestBed } from '@angular/core/testing';

import { Clothes2Service } from './clothes2.service';

describe('Clothes2Service', () => {
  let service: Clothes2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Clothes2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
