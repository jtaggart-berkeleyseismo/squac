import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '@core/services/squacapi.service';
import { MockSquacApiService } from '@core/services/squacapi.service.mock';
import { MetricsService } from './metrics.service';
import { Metric } from '@core/models/metric';

describe('MetricsService', () => {
  let metricsService: MetricsService;

  const testMetric: Metric = new Metric(
    1,
    1,
    'name',
    'code',
    'description',
    'reference',
    'unit'
  );
  let squacApiService;

  let apiSpy;
  const mockSquacApiService = new MockSquacApiService( testMetric );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    metricsService = TestBed.inject(MetricsService);
    squacApiService = TestBed.inject(SquacApiService);
  });

  it('should be created', () => {
    const service: MetricsService = TestBed.inject(MetricsService);

    expect(service).toBeTruthy();
  });


  it('should fetch metrics', (done: DoneFn) => {
    metricsService.fetchMetrics();

    metricsService.getMetrics.subscribe(metrics => {
      expect(metrics[0].id).toEqual(testMetric.id);
      done();
    });

  });

  it('should return metrics', () => {
    metricsService.getMetrics.subscribe(metrics => {
      expect(metrics).toBeTruthy();
    });
  });

  it('should get metric with id', (done: DoneFn) => {
    metricsService.getMetric(1).subscribe(metric => {
      expect(metric.name).toEqual(testMetric.name);
      done();
    });
  });

  it('should update channel group', (done: DoneFn) => {
    metricsService.updateMetric(testMetric);

    metricsService.getMetric(1).subscribe(metric => {
      expect(metric.name).toEqual(testMetric.name);
      done();
    });
  });

  it('should post channel group with id', () => {
    apiSpy = spyOn(squacApiService, 'put');

    metricsService.updateMetric(testMetric);

    expect(apiSpy).toHaveBeenCalled();
  });

  it('should put channel group without id', () => {
    apiSpy = spyOn(squacApiService, 'post');

    const newMetric = new Metric(
      null,
      1,
      'name',
      'code',
      'description',
      'reference',
      'unit'
    );

    metricsService.updateMetric(newMetric);

    expect(apiSpy).toHaveBeenCalled();
  });
});
