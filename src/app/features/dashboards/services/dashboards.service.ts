import { Injectable } from '@angular/core';
import { Dashboard } from '../models/dashboard';
import { BehaviorSubject, Observable} from 'rxjs';
import { SquacApiService } from '@core/services/squacapi.service';
import { map} from 'rxjs/operators';

interface DashboardsHttpData {
  name: string;
  description: string;
  share_all: boolean;
  share_org: boolean;
  widgets?: any;
  organization: number;
  window_seconds?: number;
  starttime?: string;
  endtime?: string;
  id?: number;
}
// should I use index or id
@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
  // private localDashboards
  localDashboards: Dashboard[] = [];
  getDashboards = new BehaviorSubject<Dashboard[]>([]);
  private url = 'dashboard/dashboards/';
  constructor(
    private squacApi: SquacApiService
  ) {
  }

  private updateDashboards(dashboards?: Dashboard[]) {
    if (dashboards) {
      this.localDashboards = dashboards;
    }
    this.getDashboards.next(this.localDashboards);
  }

  // Gets channel groups from server
  fetchDashboards(): void {

    this.squacApi.get(this.url).pipe(
      map(
        response => {
          const dashboards: Dashboard[] = [];

          response.forEach(d => {
            const dashboard = new Dashboard(
              d.id,
              d.user_id,
              d.name,
              d.description,
              d.share_org,
              d.share_all,
              d.organization,
              d.widgets ? d.widgets : []
            );
            if (response.window_seconds) {
              dashboard.timeRange = response.window_seconds;
            } else {
              dashboard.starttime = response.starttime;
              dashboard.endtime = response.endtime;
            }
            dashboards.push(dashboard);
          });
          return dashboards;
        }
      )
    )
    .subscribe(
      dashboards => {
        this.updateDashboards(dashboards);
      },
      error => {
        console.log('error in dashboards: ' + error);
      }
    );
  }

  private updateLocalDashboards(id: number, dashboard?: Dashboard) {
    const index = this.localDashboards.findIndex(d => d.id === id);

    if (index > -1) {
      if (dashboard) {
        this.localDashboards[index] = dashboard;

      } else {
        this.localDashboards.splice(index, 1);
      }
    } else {
      this.localDashboards.push(dashboard);
    }
    this.updateDashboards();
  }

  // Gets dashboard by id from SQUAC
  getDashboard(id: number): any {
    return this.squacApi.get(this.url, id).pipe(map((data) => this.mapDashboard(data)));
  }

  updateDashboard(dashboard: Dashboard): Observable<Dashboard> {
    const postData: DashboardsHttpData = {
      name: dashboard.name,
      description: dashboard.description,
      share_org: dashboard.shareOrg,
      share_all: dashboard.shareAll,
      starttime: dashboard.starttime,
      endtime: dashboard.endtime,
      organization: dashboard.orgId,
      window_seconds: dashboard.timeRange
    };
    if (dashboard.id) {
      postData.id = dashboard.id;
      return this.squacApi.put(this.url, dashboard.id, postData).pipe(
        map((data) => this.mapDashboard(data))
      );
    } else {
      return this.squacApi.post(this.url, postData).pipe(
          map((data) => this.mapDashboard(data))
        );
    }

  }

  private mapDashboard(squacData): Dashboard {
    const dashboard = new Dashboard(
      squacData.id,
      squacData.user_id,
      squacData.name,
      squacData.description,
      squacData.share_org,
      squacData.share_all,
      squacData.organization,
      squacData.widgets
    );
    if (squacData.window_seconds) {
      dashboard.timeRange = squacData.window_seconds;
    } else {
      dashboard.starttime = squacData.starttime;
      dashboard.endtime = squacData.endtime;
    }
    this.updateLocalDashboards(dashboard.id, dashboard);
    return dashboard;
  }

  deleteDashboard(dashboardId): Observable<any> {
    this.updateLocalDashboards(dashboardId);
    return this.squacApi.delete(this.url, dashboardId);
  }
}
