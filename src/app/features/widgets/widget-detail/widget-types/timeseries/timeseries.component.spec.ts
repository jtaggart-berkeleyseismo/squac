import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeseriesComponent } from './timeseries.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Subject, of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/core/services/view.service';
import { ChannelGroup } from 'src/app/core/models/channel-group';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Widget } from 'src/app/widgets/widget';

describe('TimeseriesComponent', () => {
  let component: TimeseriesComponent;
  let fixture: ComponentFixture<TimeseriesComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeseriesComponent],
      imports: [NgxChartsModule, HttpClientTestingModule],
      providers: [
        {
          provide: DataFormatService,
          useValue: {
            formattedData: of()
          }
        }

      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeseriesComponent);
    component = fixture.componentInstance;
    component.widget = new Widget(1, 2, 'name', 'description', 1, 1, 1, 1, 1, 1, 1, []);
    fixture.detectChanges();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
