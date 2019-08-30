import { Injectable } from '@angular/core';
import { ChannelGroup } from '../shared/channel-group';
import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { Channel } from '../shared/channel';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from '../squacapi';

// Describes format of post data 
interface ChannelGroupsHttpData {
  name: string, 
  description: string,
  channels: string[],
  id?: number
}

//should I use index or id
@Injectable({
  providedIn: 'root'
})
export class ChannelGroupsService extends SquacApiService{ 
  localChannelGroups : {} = {}; //Will want to store temporarily (redo on save?)  
  getChannelGroups = new BehaviorSubject<ChannelGroup[]>([]);

  constructor(
     http : HttpClient
  ) {
    super("nslc/groups/", http);
  }

  private updateChannelGroups(channelGroups: ChannelGroup[]) {
    this.getChannelGroups.next(channelGroups);
  };

  // Gets channel groups from server
  fetchChannelGroups() : void {
    super.get().pipe(
      map(
        results => {
          let channelGroups : ChannelGroup[] = [];

          results.forEach(cG => {
            let chanGroup = new ChannelGroup(
              cG.id,
              cG.name,
              cG.description
            )
            this.localChannelGroups[cG.id] = chanGroup;
            channelGroups.push(chanGroup);
          });
          return channelGroups;
        }
      )
    )
    .subscribe(result => {
      this.updateChannelGroups(result);
    });
  }

  //Gets a specific channel group from server
  getChannelGroup(id: number) : Observable<ChannelGroup>{
    if(this.localChannelGroups[id] && this.localChannelGroups[id].channels) {
      return of(this.localChannelGroups[id]);
    } else {
      return super.get(id).pipe(
        map(
          channelGroup => {
            let _channelGroup : ChannelGroup;
  
            _channelGroup = new ChannelGroup(
              channelGroup.id,
              channelGroup.name, 
              channelGroup.description
            )
  
            channelGroup.channels.forEach(channel => {
              let chan = new Channel(
                channel.id,
                channel.name,
                channel.code,
                channel.sample_rate,
                channel.lat,
                channel.lon,
                channel.elev,
                channel.loc,
                channel.station_code,
                channel.network
              );

              _channelGroup.channels.push(chan);
            });
            this.localChannelGroups[channelGroup.id] = _channelGroup;
            return _channelGroup;
          }
        )
      )
    }
  }

  // Replaces channel group with new channel group
  updateChannelGroup(channelGroup: ChannelGroup) : Observable<ChannelGroup> {
    let postData : ChannelGroupsHttpData = {
      name: channelGroup.name,
      description: channelGroup.description,
      channels : channelGroup.channelsIdsArray
    }
    if(channelGroup.id) {
      postData.id = channelGroup.id;
      this.localChannelGroups[channelGroup.id] = null;
    }
    return super.post(postData);
  }

}
