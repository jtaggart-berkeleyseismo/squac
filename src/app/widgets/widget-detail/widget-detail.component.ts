import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../widgets.service';
import { MeasurementsService } from '../measurements.service';
import { ViewService } from 'src/app/shared/view.service';
import { DataFormatService } from '../data-format.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetEditComponent } from '../widget-edit/widget-edit.component';

@Component({
  selector: 'app-widget-detail',
  templateUrl: './widget-detail.component.html',
  styleUrls: ['./widget-detail.component.scss'],
  providers: [DataFormatService]
})
export class WidgetDetailComponent implements OnInit, OnDestroy {

  @Input() widget: Widget;
  data: any;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  // temp

  styles: any;

  constructor(
    private viewService: ViewService,
    private dataFormatService: DataFormatService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    // listed to changes and detch when needed
    this.dataFormatService.fetchData(this.widget);

    const datesSub = this.viewService.dates.subscribe(
      dates => {
        console.log('new dates');
        this.dataFormatService.fetchData(this.widget);
      },
      error => {
        console.log("error in widget detail dates: " + error);
      }
    );
    this.subscription.add(datesSub);
    // widget data errors here
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  editWidget() {
    const dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: this.widget,
        dashboardId: this.widget.dashboardId
      }
    });
    dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          this.viewService.updateWidget(result.id);
        } else {
          console.log('widget edited and something went wrong');
        }
      }, error => {
        console.log("error in widget detail: " + error);
      }
    );
  }

  deleteWidget() {
    this.viewService.deleteWidget(this.widget.id);
  }
}
