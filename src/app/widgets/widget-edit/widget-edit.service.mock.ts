import { BehaviorSubject, Subject } from 'rxjs';
import { Metric } from 'src/app/shared/metric';
import { Threshold } from '../threshold';
import { Widget } from '../widget';
import { ChannelGroup } from 'src/app/shared/channel-group';

export class MockWidgetEditService {
  metrics = new BehaviorSubject<Metric[]>([]);
  isValid = new Subject<boolean>();

  testThresholds: { [metricId: number]: Threshold} = {
    1 : new Threshold(1, 1, 1, 1, 1)
  };

  testChannelGroup: ChannelGroup = new ChannelGroup(
    1,
    'name',
    'name',
    []
  );

  testWidget: Widget = new Widget(
    1,
    'name',
    'description',
    1,
    1,
    1,
    1,
    1,
    1,
    1,
    []
  );

  updateValidity() {
    this.isValid.next(true);
  }

  getThresholds() {
    return this.testThresholds;
  }

  setWidget(widget: Widget) {
    if (widget) {
      this.metrics.next(widget.metrics);
    }
    this.updateValidity();
  }

  getChannelGroup() {
    return this.testChannelGroup;
  }

  getWidget() {
    return this.testWidget;
  }

  getMetricIds() {
    return [1, 2, 3];
  }

  updateChannelGroup(channelGroup) {
    this.updateValidity();
  }

  updateMetrics(metrics) {
    this.updateValidity();
  }

  updateType(id) {
    this.updateValidity();
  }

  updateThresholds(thresholds) {
    this.updateValidity();
  }

  updateWidgetInfo(name: string, description: string, dashboardId: number, statType) {
    this.updateValidity();
  }

  clearWidget() {

  }

}
