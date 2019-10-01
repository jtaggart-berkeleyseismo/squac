import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SquacApiService } from '../squacapi.service';
import { MockSquacApiService } from '../squacapi.service.mock';
import { ChannelGroupsService } from './channel-groups.service';
import { ChannelGroup } from '../shared/channel-group';

describe('ChannelGroupsService', () => {
  let channelGroupsService: ChannelGroupsService;

  const testChannelGroup: ChannelGroup = new ChannelGroup(
    1,
    'name',
    'description',
    []
  );
  let squacApiService;

  let apiSpy;
  const mockSquacApiService = new MockSquacApiService( testChannelGroup );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{
        provide: SquacApiService, useValue: mockSquacApiService
      }]
    });

    channelGroupsService = TestBed.get(ChannelGroupsService);
    squacApiService = TestBed.get(SquacApiService);
  });

  it('should be created', () => {
    const service: ChannelGroupsService = TestBed.get(ChannelGroupsService);

    expect(service).toBeTruthy();
  });


  it('should fetch channelGroups', (done: DoneFn) => {
    channelGroupsService.fetchChannelGroups();

    channelGroupsService.channelGroups.subscribe(channelGroups => {
      expect(channelGroups[0].id).toEqual(testChannelGroup.id);
      done();
    });

  });

  it('should return channelGroups', () => {
    channelGroupsService.channelGroups.subscribe(channelGroups => {
      expect(channelGroups).toBeTruthy();
    });
  });

  it('should get channelGroup with id', (done: DoneFn) => {
    channelGroupsService.getChannelGroup(1).subscribe(channelGroup => {
      expect(channelGroup).toEqual(testChannelGroup);
      done();
    });
  });

  it('should update channel group', (done: DoneFn) => {
    channelGroupsService.updateChannelGroup(testChannelGroup);

    channelGroupsService.getChannelGroup(1).subscribe(channelGroup => {
      expect(channelGroup.name).toEqual(testChannelGroup.name);
      done();
    });
  });

  it('should post channel group with id', () => {
    apiSpy = spyOn(squacApiService, 'put');

    channelGroupsService.updateChannelGroup(testChannelGroup);

    expect(apiSpy).toHaveBeenCalled();
  });

  it('should put channel group without id', () => {
    apiSpy = spyOn(squacApiService, 'post');

    const newChannelGroup = new ChannelGroup(
      null,
      'name',
      'description',
      []
    );

    channelGroupsService.updateChannelGroup(newChannelGroup);

    expect(apiSpy).toHaveBeenCalled();
  });
});
