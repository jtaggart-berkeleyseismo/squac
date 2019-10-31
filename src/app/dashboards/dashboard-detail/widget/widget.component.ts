import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Widget } from '../../widget';
import { ActivatedRoute, Router } from '@angular/router';
import { ChannelGroup } from '../../../shared/channel-group';
import { MeasurementsService } from '../../measurements.service';
import { Subscription, Subject } from 'rxjs';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss']
})
export class WidgetComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  @Input() channelGroup: ChannelGroup;
  @Input() reload: Subject<boolean>;
  @Input() startdate: string;
  @Input() enddate: string;
  hasData = false;
  subscription = new Subscription();
  dataUpdate = new Subject<any>();
  //temp 
  columnWidth = 100;
  rowHeight = 100;

  styles : any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private measurementsService: MeasurementsService
  ) { }

  ngOnInit() {
    // show loading
    if (this.widget && this.widget.metrics && this.channelGroup) {
      this.styles = {
        "width.px" : this.widget.columns * this.columnWidth,
        "height.px" : this.widget.rows * this.rowHeight,
        "order": this.widget.order
      }
      let sub = this.getData();
      const sub1 = this.reload.subscribe(reload => {
        console.log(this.widget.metrics);
        if (reload) {
          sub = this.getData();
        }
      });
      this.subscription.add(sub);
      this.subscription.add(sub1);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getData() {
    return this.measurementsService.getMeasurements(
      this.widget,
      this.channelGroup,
      this.startdate,
      this.enddate
    ).subscribe(
      response => {
        this.hasData = true;
        this.dataUpdate.next(response);
        // hiding loading
      }
    );
  }

  onResizeEnd(event: ResizeEvent): void {
    const row = Math.round(event.rectangle.height / this.rowHeight);
    const column = Math.round(event.rectangle.width / this.columnWidth);


    this.widget.rows = row > 0 ? row : 1;
    this.widget.columns = column > 0 ? column : 1;

    this.styles = {
      "width.px" : this.widget.columns * this.columnWidth,
      "height.px" : this.widget.rows * this.rowHeight,
      "order": this.widget.order
    };
  }

  editWidget() {
    this.router.navigate(['widget', this.widget.id, 'edit'], {relativeTo: this.route});
  }
}
