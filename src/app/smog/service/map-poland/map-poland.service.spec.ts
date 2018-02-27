import { TestBed, inject } from '@angular/core/testing';

import { MapPolandService } from './map-poland.service';

describe('MapPolandService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapPolandService]
    });
  });

  it('should be created', inject([MapPolandService], (service: MapPolandService) => {
    expect(service).toBeTruthy();
  }));
});
