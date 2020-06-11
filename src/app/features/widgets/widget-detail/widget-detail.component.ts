import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Widget } from '../../../core/models/widget';
import { ChannelGroup } from 'src/app/core/models/channel-group';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WidgetsService } from '../widgets.service';
import { MeasurementsService } from '../measurements.service';
import { ViewService } from 'src/app/core/services/view.service';
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
  dialogRef;
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
        this.viewService.status.next('loading');
      },
      error => {
        console.log('error in widget detail dates: ' + error);
      }
    );
    this.subscription.add(datesSub);
    // widget data errors here
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  editWidget() {
    this.dialogRef = this.dialog.open(WidgetEditComponent, {
      data : {
        widget: this.widget,
        dashboardId: this.widget.dashboardId
      }
    });
    this.dialogRef.afterClosed().subscribe(
      result => {
        if (result && result.id) {
          this.viewService.updateWidget(result.id);
        } else {
          console.log('widget edit closed without saving');
        }
      }, error => {
        console.log('error in widget detail: ' + error);
      }
    );
  }

  deleteWidget() {
    this.viewService.deleteWidget(this.widget.id);
  }
}
