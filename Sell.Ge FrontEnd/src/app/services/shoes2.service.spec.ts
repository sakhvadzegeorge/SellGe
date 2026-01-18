import { TestBed } from '@angular/core/testing';

import { Shoes2Service } from './shoes2.service';

describe('Shoes2Service', () => {
  let service: Shoes2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Shoes2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
