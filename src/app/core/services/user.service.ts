import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { User } from '../models/user';
import { SquacApiService } from './squacapi.service';
import { Ability, AbilityBuilder } from '@casl/ability';
import { defineAbilitiesFor, AppAbility } from '../utils/ability';
import { OrganizationsService } from './organizations.service';
import { flatMap } from 'rxjs/operators';

interface UserHttpData {
  email: string;
  password: string;
  firstname: string;
  lastname:	string;
  organization: string;
}

// Service to get user info & reset things
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url = 'user/me/';
  private currentUser;
  user = new ReplaySubject<User>();

  constructor(
    private http: HttpClient,
    private squacApi: SquacApiService,
    private ability: AppAbility,
    private orgService: OrganizationsService
  ) { }

  getUser(): User {
    return this.currentUser;
  }

  fetchUser() {
    this.squacApi.get(this.url).pipe(
      flatMap( response => {
        const groups = [];
        for (const group of response.groups) {
          groups.push(group.name);
        }

        this.currentUser = new User(
          response.id,
          response.email,
          response.firstname,
          response.lastname,
          response.is_staff,
          groups
        );

        return this.orgService.getOrganizationsForUser(response.id);
      })
    )
    .subscribe(
      response => {
        this.currentUser.orgUsers = response;
        console.log(this.currentUser)
        this.ability.update(defineAbilitiesFor(this.currentUser));
        this.user.next(this.currentUser);
      },

      error => {
        console.log('error in user service: ' + error);
      }
    );
  }

  logout() {
    this.user.next(null);
    this.ability.update([]);
  }

  // User needs to enter password to make changes
  updateUser(user) {
    const putData: UserHttpData = user;

    // other user ifo
    return this.squacApi.patch(this.url, null, putData);
    // TODO: after it puts, update current user
  }


}
