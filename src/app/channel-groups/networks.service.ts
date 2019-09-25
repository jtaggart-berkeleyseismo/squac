import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Network } from './network';
import { SquacApiService } from '../squacapi.service';

@Injectable({
  providedIn: 'root'
})

// Service for handling networks
export class NetworksService {

  // Copy of networks searched
  private localNetworks : {} = {};
  private url = "nslc/networks/";
  // Subscribeable networks 
  networks = new BehaviorSubject<Network[]>([]);

  constructor(
    private squacApi : SquacApiService
  ) {
  }

  // Broadcast updated networks
  private setNetworks(networks : Network[]) {
    this.networks.next(networks);
  }

  // Get all networks from api
  fetchNetworks(){
    this.squacApi.get(this.url).pipe(
      map(
        networks => {
          let nets : Network[] = [];
          networks.forEach(network => {
            let net = new Network(
              network.id,
              network.code,
              network.name,
              network.description
            )
            this.localNetworks[network.id] = net;

            nets.push(net);
          });
          return nets;
        }
      )
    )
    .subscribe(networks => {
      this.setNetworks(networks);
    });
  }


  //Get network with given ID, will search local
  // or return from server
  getNetwork(id: number) :Observable<Network>{
    if(this.localNetworks[id]) {
      return of(this.localNetworks[id]);
    } else {
      return this.squacApi.get(this.url, id).pipe(
        map(
          network => {
            let networkObject = new Network(
              network.id,
              network.code,
              network.name,
              network.description
            );
            this.localNetworks[network.id] = networkObject;
            return networkObject;
          }
        )
      );
    }
  }
}
