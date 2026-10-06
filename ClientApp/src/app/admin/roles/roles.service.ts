import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ROLE_URLS } from './role.url-config';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  getRolesList(data) {
    return this.http.post(ROLE_URLS.ROLES_LIST, data);
  }

  createRole(data) {
    return this.http.post(ROLE_URLS.CREATE_ROLE, data);
  }

  editRole(data, roleId) {
    return this.http.post(ROLE_URLS.EDIT_ROLE + roleId, data);
  }

  deleteRole(data) {
    return this.http.post(ROLE_URLS.DELETE_ROLE, data);
  }

  getUserRoles(userId) {
    return this.http.get(ROLE_URLS.GET_USER_ROLES_LIST + userId);
  }

  getRolesWithoutPagination() {
    return this.http.get(ROLE_URLS.GET_ROLES_WITHOUT_PAGINATION);
  }
}
