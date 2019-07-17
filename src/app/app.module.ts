import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { MetricGroupsComponent } from './metric-groups/metric-groups.component';
import { MetricGroupsEditComponent } from './metric-groups/metric-groups-edit/metric-groups-edit.component';
import { MetricGroupsDetailComponent } from './metric-groups/metric-groups-detail/metric-groups-detail.component';
import { DashboardEditComponent } from './dashboards/dashboard-edit/dashboard-edit.component';
import { ChannelGroupsComponent } from './channel-groups/channel-groups.component';
import { ChannelGroupsEditComponent } from './channel-groups/channel-groups-edit/channel-groups-edit.component';
import { ChannelGroupsDetailComponent } from './channel-groups/channel-groups-detail/channel-groups-detail.component';
import { ViewDetailComponent } from './views/view-detail/view-detail.component';
import { ViewEditComponent } from './views/view-edit/view-edit.component';
import { ViewsComponent } from './views/views.component';
import { DashboardDetailComponent } from './dashboards/dashboard-detail/dashboard-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardsComponent,
    MetricGroupsComponent,
    MetricGroupsEditComponent,
    MetricGroupsDetailComponent,
    DashboardEditComponent,
    ChannelGroupsComponent,
    ChannelGroupsEditComponent,
    ChannelGroupsDetailComponent,
    ViewDetailComponent,
    ViewEditComponent,
    ViewsComponent,
    DashboardDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
