import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { WidgetsService } from './widgets.service';
import { Widget } from './widget';

describe('WidgetsService', () => {
  const testData = {
    id: 1,
    name: 'test',
    widgettype : {
      id: 1,
      type: 'type'
    },
    dashboard: {
      id: 1
    },
    metrics: []
  };

  let squacApiService;
  let widgetsService: WidgetsService;
  const mockSquacApiService = new MockSquacApiService( testData );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    widgetsService = TestBed.get(WidgetsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: WidgetsService = TestBed.get(WidgetsService);
    expect(service).toBeTruthy();
  });

  it('should get widgets with multiple ids', (done: DoneFn) => {
    widgetsService.getWidgets([1, 1, 1]).subscribe(widgets => {
      expect(widgets.length).toEqual(3);
      done();
    });
  });

  it('should get widget with id', (done: DoneFn) => {
    widgetsService.getWidget(1).subscribe(widget => {
      expect(widget.id).toEqual(testData.id);
      done();
    });
  });
});

