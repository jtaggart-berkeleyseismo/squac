import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  loading: boolean;
  status: string;
  loadSub: Subscription;
  constructor(
    private loadingService: LoadingService
    ) { }

  ngAfterViewInit(): void {
    this.loadSub = this.loadingService.loading.subscribe(
      loading => { this.loading = loading }
    )
    this.status = "text here";
  }

  ngOnDestroy(): void {
    this.loadSub.unsubscribe();
  }

}
