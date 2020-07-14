import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SquacApiService } from './squacapi.service';
import { BehaviorSubject } from 'rxjs';
import { Organization } from '@core/models/organization';

interface OrganizationHttpData {

}

// Service to get user info & reset things
@Injectable({
providedIn: 'root'
})
export class OrganizationsService {
private url = 'organization/organizations/';
private organizations = new BehaviorSubject<Organization[]>([]);
private localOrganizations : Organization[] = [];
constructor(
  private http: HttpClient,
  private squacApi: SquacApiService
) { }


fetchOrganizations() {
  this.squacApi.get(this.url).subscribe(
    response => {
      const organizations = [];
      for (let organization of response) {
        const newOrg = new Organization(
          organization.id,
          organization.name,
          [],
          organization.slug,
          organization.is_active
        );
        this.localOrganizations.push(newOrg);
      }
      this.organizations.next(this.localOrganizations);
    },

    error => {
      console.log('error in user service: ' + error);
    }
  );
}

}