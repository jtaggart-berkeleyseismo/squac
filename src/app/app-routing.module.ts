import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ChannelGroupsViewComponent } from './channel-groups/channel-groups-view/channel-groups-view.component';
import { MetricsComponent } from './metrics/metrics.component';
import { MetricsEditComponent } from './metrics/metrics-edit/metrics-edit.component';
import { MetricsViewComponent } from './metrics/metrics-view/metrics-view.component';
import { MetricsDetailComponent } from './metrics/metrics-detail/metrics-detail.component';

//TODO:consider breaking into module for creation stuff
export const appRoutes: Routes = [
  { path: 'login', component: AuthComponent},
  { path: '', redirectTo: 'dashboards', pathMatch: 'full'},
  { path: 'metrics', 
    component: MetricsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: MetricsViewComponent, pathMatch: 'full'},
      { path: 'new', component: MetricsEditComponent},
      { path: ':id', component: MetricsDetailComponent},
      { path: ':id/edit', component: MetricsEditComponent },
    ]
  },
  { path: 'channel-groups', 
    component: ChannelGroupsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ChannelGroupsViewComponent, pathMatch: 'full'},
      { path: 'new', component: ChannelGroupsEditComponent},
      { path: ':id', component: ChannelGroupsDetailComponent},
      { path: ':id/edit', component: ChannelGroupsEditComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
