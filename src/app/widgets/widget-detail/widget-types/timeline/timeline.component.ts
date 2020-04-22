import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Metric } from '../../../../shared/metric';
import { Channel } from '../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../measurement.pipe';
import { Subscription, GroupedObservable } from 'rxjs';
import { Measurement } from 'src/app/widgets/measurement';
import { DataFormatService } from 'src/app/widgets/data-format.service';
import { ViewService } from 'src/app/shared/view.service';
import { ChannelGroup } from 'src/app/shared/channel-group';
import { Widget } from 'src/app/widgets/widget';
import { Threshold } from 'src/app/widgets/threshold';
import TimelinesChart, { TimelinesChartInstance } from 'timelines-chart';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  providers: [MeasurementPipe]
})
export class TimelineComponent implements OnInit, OnDestroy {
  @Input() widget: Widget;
  metrics: Metric[];
  thresholds: {[metricId: number]: Threshold};
  channelGroup: ChannelGroup;

  channels: Channel[];
  @ViewChild('dataTable') table: any;
  subscription = new Subscription();
  ColumnMode = ColumnMode;
  SortType = SortType;
  rows = [];
  columns = [];
  currentMetric: Metric;
  enddate: Date;
  startdate: Date;
  // get start date and end date
  messages = {
      // Message to show when array is presented
  // but contains no values
    emptyMessage: 'Loading data.',

    // Footer total message
    totalMessage: 'total',

    // Footer selected message
    selectedMessage: 'selected'
  };

  timeline: TimelinesChartInstance;

  // rows = [];
  constructor(
    private dataFormatService: DataFormatService,
    private viewService: ViewService,
    private measurement: MeasurementPipe
  ) { }

  ngOnInit() {

    this.metrics = this.widget.metrics;
    this.thresholds = this.widget.thresholds;
    this.channelGroup = this.widget.channelGroup;
    if ( this.channelGroup) {
      this.channels = this.channelGroup.channels;
    }


    const dateFormatSub = this.dataFormatService.formattedData.subscribe(
      response => {
        if (response) {
          this.startdate = this.viewService.getStartdate();
          this.enddate = this.viewService.getEnddate();

          this.currentMetric = this.metrics[0]; // TODO: get this a diffetent way
          this.buildRows(response);
        }
      }, error => {
        console.log('error in timeline data: ' + error);
      }
    );


    this.subscription.add(dateFormatSub);

    /**
     * Setup for the D3 timelines chart. Currently is filled with some dummy data just
     * to make sure that things are working.
     * Data syntax:
     * [
     *   {
     *     group: "group1name",
     *     data: [
     *       {
     *         label: "label1name",
     *         data: [
     *           {
     *             timeRange: [<date>, <date>],
     *             val: <val: number (continuous dataScale) or string (ordinal dataScale)> 
     *           },
     *           {
     *             timeRange: [<date>, <date>],
     *             val: <val>
     *           },
     *           (...)
     *         ]
     *       },
     *       {
     *         label: "label2name",
     *         data: [...]
     *       },
     *       (...)
     *     ],
     *   },
     *   {
     *     group: "group2name",
     *     data: [...]
     *   },
     *   (...)
     * ]
     * At the bottom in parentheses is the element which this will be appended to.
     * 
     * timelines-chart readme: https://github.com/vasturiano/timelines-chart
     */
    this.timeline = TimelinesChart()
      .width(900)
      .data([
        {
          group: "ALKI",
          data: [
              {
                label: "ENE",
                data: [
                  {
                    timeRange: [new Date(2013,2,21, 12, 31), new Date(2013, 2, 23, 1, 53)],
                    val: 'In spec'
                  },
                  {
                    timeRange: [new Date(2013,2,24, 8, 17), new Date(2013, 2, 26, 1, 53)],
                    val: 'Out of spec'
                  },
                  {
                    timeRange: [new Date(2013,2,26, 4, 17), new Date(2013, 2, 27, 8, 53)],
                    val: 'In spec'
                  }
                ]
              },
              {
                label: "ENN",
                data: [
                  {
                    timeRange: [new Date(2013, 2, 21, 12, 31), new Date(2013, 2, 23, 8, 53)],
                    val: 'In spec'
                  },
                  {
                    timeRange: [new Date(2013, 2, 24, 3, 17), new Date(2013, 2, 26, 9, 53)],
                    val: 'Out of spec'
                  },
                  {
                    timeRange: [new Date(2013, 2, 26, 14, 17), new Date(2013, 2, 27, 3, 53)],
                    val: 'In spec'
                  }
                ]
              },
              {
                label: "ENZ",
                data: [
                  {
                    timeRange: [new Date(2013, 2, 21, 16, 31), new Date(2013, 2, 23, 2, 53)],
                    val: 'In spec'
                  },
                  {
                    timeRange: [new Date(2013, 2, 24, 12, 17), new Date(2013, 2, 26, 19, 53)],
                    val: 'Out of spec'
                  },
                  {
                    timeRange: [new Date(2013, 2, 26, 21, 17), new Date(2013, 2, 28, 1, 53)],
                    val: 'In spec'
                  }
                ]
              }
            ]
        }
      ])
      .zQualitative(true)
      (document.getElementById('timeline-chart'));

    // const resizeSub = this.viewService.resize.subscribe(
    //   widgetId => {
    //     if (widgetId === this.widget.id) {
    //       this.resize();
    //     }
    //   }, error => {
    //     console.log('error in timeline resize: ' + error);
    //   }

    // );

    // this.subscription.add(resizeSub);
  }

  // private resize() {
  //   this.rows = [...this.rows];
  // }

  private replaceChannel(channel, station) {
    const newStation = {...channel};
    newStation.treeStatus = station.treeStatus;
    newStation.id = station.id;
    newStation.title = station.title;
    newStation.parentId = null;
    return newStation;
  }

  private buildRows(data) {
    const rows = [];
    const stations = [];
    const stationRows = [];
    const starttimeInSec = this.startdate.getTime() / 1000;
    const endtimeInSec = this.enddate.getTime() / 1000;
    const rangeInSec = endtimeInSec - starttimeInSec;
    const threshold = this.thresholds[this.currentMetric.id];
    this.channels.forEach((channel) => {
      const identifier = channel.networkCode + '.' + channel.stationCode;
      const timeline = [];

      const agg = 0;

      let isBad = false;
      data[channel.id][this.currentMetric.id].forEach(
       (measurement: Measurement, index) => {
          const start = new Date(measurement.starttime).getTime() / 1000;
          const end = new Date(measurement.endtime).getTime() / 1000;
          const inThreshold = threshold ? this.checkThresholds(threshold, measurement. value) : false;
          timeline.push(

            {
              end: (end - starttimeInSec) / rangeInSec,
              styles: {
                width : (end - start) / rangeInSec * 100 + '%',
                left : (start - starttimeInSec) / rangeInSec * 100 + '%'
              },
              info: measurement.starttime + ' ' + measurement.endtime + ' ' + measurement.value,
              threshold: inThreshold
            }
          );
          if (index === 0 && !inThreshold && threshold) {
            isBad = true;
          }
        }
      );
      const row = {
        title: channel.loc + '.' + channel.code,
        id: channel.id,
        nslc: channel.nslc,
        parentId: identifier,
        treeStatus: 'disabled',
        timeline
      };

      const staIndex = stations.indexOf(identifier);
      if (staIndex < 0) {
        stations.push(identifier);
        stationRows.push(
          {
            ...{
              title: channel.networkCode + '.' + channel.stationCode,
              id: identifier,
              treeStatus: 'collapsed',
              staCode: channel.stationCode,
              netCode: channel.networkCode,
              timeline
            },
          }
        );
      } else if (isBad || stationRows[staIndex].timeline.length === 0) {
        stationRows[staIndex] = this.replaceChannel(row, stationRows[staIndex]);
      }
      rows.push(row);
    });

    this.rows = [...stationRows, ...rows];
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'loading';
      row.treeStatus = 'expanded';
      this.rows = [...this.rows];
    } else {
      row.treeStatus = 'collapsed';
      this.rows = [...this.rows];
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // // TODO: yes, this is bad boolean but I'm going to change it
  checkThresholds(threshold, value): boolean {
    let withinThresholds = true;
    if (threshold.max && value != null && value > threshold.max) {
      withinThresholds = false;
    }
    if (threshold.min && value != null && value < threshold.min) {
      withinThresholds = false;
    }
    if (!threshold.min && !threshold.max) {
      withinThresholds = false;
    }
    return withinThresholds;
  }

}
