/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GeoService } from './geo.service';

describe('Service: Geo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeoService]
    });
  });

  it('should ...', inject([GeoService], (service: GeoService) => {
    expect(service).toBeTruthy();
  }));
});
