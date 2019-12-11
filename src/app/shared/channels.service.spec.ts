import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { ChannelsService } from './channels.service';
import { Channel } from '../shared/channel';
import { Network } from '../channel-groups/network';

describe('ChannelsService', () => {
  let channelsService: ChannelsService;

  const testChannel: Channel = new Channel(
    1,
    'code',
    'name',
    0,
    0,
    0,
    0,
    'loc',
    'stationCode',
    'networkCode'
  );
  let squacApiService;
  const mockSquacApiService = new MockSquacApiService( testChannel );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    channelsService = TestBed.get(ChannelsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelsService = TestBed.get(ChannelsService);

    expect(service).toBeTruthy();
  });

  it('should return channels', () => {
    channelsService.channels.subscribe(channels => {
      expect(channels).toBeTruthy();
    });
  });

  it('should get channel with id', (done: DoneFn) => {
    channelsService.getChannel(1).subscribe(channel => {
      expect(channel.id).toEqual(testChannel.id);
      done();
    });
  });
});
