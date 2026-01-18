import { TestBed } from '@angular/core/testing';

import { OrderedService } from './ordered.service';

describe('OrderedService', () => {
  let service: OrderedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
