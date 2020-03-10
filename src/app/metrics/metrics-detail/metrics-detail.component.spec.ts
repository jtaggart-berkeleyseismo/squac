import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDetailComponent } from './metrics-detail.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MetricsService } from 'src/app/shared/metrics.service';
import { of, Observable } from 'rxjs';
import { Metric } from 'src/app/shared/metric';
import { MockMetricsService } from 'src/app/shared/metrics.service.mock';

describe('MetricsDetailComponent', () => {
  let component: MetricsDetailComponent;
  let fixture: ComponentFixture<MetricsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ MetricsDetailComponent ],
      providers: [
        { provide: MetricsService, useClass: MockMetricsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
