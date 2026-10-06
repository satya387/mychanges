import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { USERS_URLS } from './users.url-config';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getUsersList() {
    return this.http.get(USERS_URLS.USERS_LIST);
  }

  getUsersGridData(data) {
    return this.http.post(USERS_URLS.USERS_GRID, data);
  }

  saveRolesToUser(data) {
    return this.http.post(USERS_URLS.ASSIGN_ROLES_USER, data);
  }

  saveSectionsToUser(data) {
    return this.http.post(USERS_URLS.ASSIGN_SECTIONS_USER, data);
  }

  saveTilesToUser(data) {
    return this.http.post(USERS_URLS.ASSIGN_TILES_USER, data);
  }
}
