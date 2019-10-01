import { Injectable } from '@angular/core';
import { Dashboard } from './dashboard';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Widget } from './widget';
import { SquacApiService } from '../squacapi.service';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap, concatMap, switchMap } from 'rxjs/operators';
import { ChannelGroupsService } from '../channel-groups/channel-groups.service';

interface DashboardsHttpData {
  name: string;
  description: string;
  group: number;
  widgets: any;
  id?: number;
}
// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  // private localDashboards
  getDashboards = new BehaviorSubject<Dashboard[]>([]);
  private url = 'dashboard/dashboards/';
  constructor(
    private channelGroupsService: ChannelGroupsService,
    private squacApi: SquacApiService
  ) {
  }

  private updateDashboards(dashboards: Dashboard[]) {
    this.getDashboards.next(dashboards);
  }

  // Gets channel groups from server
  fetchDashboards(): void {
    // temp
    console.log('fetch dashboards');
    this.squacApi.get(this.url).pipe(
      map(
        response => {
          const dashboards: Dashboard[] = [];

          response.forEach(d => {
            const dashboard = new Dashboard(
              d.id,
              d.name,
              d.description,
              d.group,
              d.widgets ? d.widgets : []
            );
            dashboards.push(dashboard);
          });
          return dashboards;
        }
      )
    )
    .subscribe(dashboard => {
      this.updateDashboards(dashboard);
    });
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): any {
    let dashboard: Dashboard;
    return this.squacApi.get(this.url, id).pipe(
      switchMap (
        (response) => {
          return this.channelGroupsService.getChannelGroup(response.group).pipe(
            map ( channelGroup => {
              dashboard = new Dashboard(
                response.id,
                response.name,
                response.description,
                response.group,
                response.widgets
              );
              dashboard.channelGroup = channelGroup;
              return dashboard;
            })
          );
        }
      )
    );
  }

  // FIXME: currently creates a copy
  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData: DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      group: dashboard.channelGroupId,
      widgets: dashboard.widgets
    };
    if (dashboard.id) {
      postData.id = dashboard.id;
      return this.squacApi.put(this.url, dashboard.id, postData);
    } else {
      return this.squacApi.post(this.url, postData);
    }

  }
}
