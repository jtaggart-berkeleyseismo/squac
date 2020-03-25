import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsEditComponent } from './metrics-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MetricsService } from 'src/app/shared/metrics.service';
import { of, Observable } from 'rxjs';
import { Metric } from 'src/app/shared/metric';
import { MockMetricsService } from 'src/app/shared/metrics.service.mock';
import { ActivatedRoute } from '@angular/router';
import { AbilityModule } from '@casl/angular';
import { Ability } from '@casl/ability';

describe('MetricsEditComponent', () => {
  let component: MetricsEditComponent;
  let fixture: ComponentFixture<MetricsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        AbilityModule
      ],
      declarations: [ MetricsEditComponent ],
      providers: [
        {provide: MetricsService, useClass: MockMetricsService},
        {provide: Ability, useValue: new Ability()}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log(component.id, component.editMode);
    expect(component).toBeTruthy();
  });
});
