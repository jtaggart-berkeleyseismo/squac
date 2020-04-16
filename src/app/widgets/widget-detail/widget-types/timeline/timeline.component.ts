import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { Metric } from '../../../../shared/metric';
import { Channel } from '../../../../shared/channel';
import { ColumnMode, SortType } from '@swimlane/ngx-datatable';
import { MeasurementPipe } from '../../../measurement.pipe';
import { Subscription } from 'rxjs';
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

  // Timeline
  timeline: any;

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

    this.timeline = TimelinesChart()
      .width(900)
      .data(this.getRandomData(true))
      .zQualitative(true)
      (document.getElementById('chart'));

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

  getRandomData = (ordinal: boolean) => {
    console.log(document.getElementById('chart'));
    console.log(this.metrics, this.channelGroup);
    console.log(this.rows);
    const NGROUPS = 6,
        MAXSEGMENTS = 20,
        MINTIME = new Date(2013,2,21);

    const nCategories = 2,
        categoryLabels = ['In Spec','Out of Spec'],
        stations = ['ALKI', 'ALCT', 'BEER', 'RCM', 'CPW', 'PUPY'];

    return [...Array(NGROUPS).keys()].map(i => ({
        group: stations[i],
        data: getGroupData()
    }));

    //

    function getGroupData() {
      const channels = ['ENN', 'ENE', 'ENZ'];

      return [...Array(3).keys()].map(i => ({
        label: channels[i],
        data: getSegmentsData()
      }));

      //

      function getSegmentsData() {
        const nSegments = Math.ceil(Math.random()*MAXSEGMENTS);
        const segMaxLength = Math.round(((new Date().valueOf())-MINTIME.valueOf())/nSegments);
        let runLength = MINTIME;

        return [...Array(nSegments).keys()].map(i => {
          const tDivide = [Math.random(), Math.random()].sort(),
            start = new Date(runLength.getTime() + tDivide[0]*segMaxLength),
            end = new Date(runLength.getTime() + tDivide[1]*segMaxLength);

          runLength = new Date(runLength.getTime() + segMaxLength);

          return {
            timeRange: [start, end],
            val: ordinal ? categoryLabels[Math.floor(Math.random()*nCategories)] : Math.random()
            //labelVal: is optional - only displayed in the labels
          };
        });
      }
    }
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
