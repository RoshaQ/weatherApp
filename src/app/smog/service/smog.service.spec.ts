import { TestBed, inject } from '@angular/core/testing';

import { SmogService } from './smog.service';

describe('SmogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SmogService]
    });
  });

  it('should be created', inject([SmogService], (service: SmogService) => {
    expect(service).toBeTruthy();
  }));
});
