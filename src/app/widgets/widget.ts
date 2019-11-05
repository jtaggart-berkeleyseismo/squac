import { ChannelGroup } from '../shared/channel-group';
import { Metric } from '../shared/metric';
import { Dashboard } from '../dashboards/dashboard';
import { Threshold } from './threshold';

export class Widget {
  public type: string;

  constructor(
    public id: number,
    public name: string,
    public description: string,
    public typeId: number,
    public dashboardId: number,
    public columns: number,
    public rows: number,
    public order: number,
    public metrics: Metric[]
  ) {

  }
  // json of settings

  // get ids from the channels
  get metricsIds(): string[] {
    const array = [];

    this.metrics.forEach(metric => {
      array.push(metric.id);
    });

    return array;
  }

  get metricsString(): string {
    return this.metricsIds.toString();
  }
}