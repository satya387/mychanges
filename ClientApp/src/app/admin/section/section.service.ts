import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { SECTION_URLS } from './section.url-config';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

  mappedSections = new Subject();
  constructor(private http: HttpClient) { }

  getAllSections() {
    return this.http.get(SECTION_URLS.GET_ALL_MODULES);
  }

  getRoleBasedSection(roleId) {
    return this.http.get(SECTION_URLS.ROLES_BASED_SECTIONS + roleId);
  }

  getSectionList(data) {
    return this.http.post(SECTION_URLS.GET_SECTION_LIST, data);
  }

  createSection(data) {
    return this.http.post(SECTION_URLS.CREATE_SECTIONS, data);
  }

  // edit section
  editSection(data) {
    return this.http.post(SECTION_URLS.UPDATE_SECTIONS, data);
  }

  // delete section
  deleteSection(data) {
    return this.http.post(SECTION_URLS.DELETE_SECTIONS, data);
  }

  // delete section
  deleteDefaultSection(data) {
    return this.http.post(SECTION_URLS.DELETE_DEFAULT_SECTIONS, data);
  }

  // Get mapped sections and tiles by user
  getUserModulesTiles(userId) {
    return this.http.get(SECTION_URLS.GET_USER_MODULES_TILES + userId);
  }

  //Assign tiles to sections
  assignTilesToSection(data) {
    return this.http.post(SECTION_URLS.ASSIGN_TILES_TO_SECTIONS, data);
  }

  //Get default section list
  getDefaultSectionsList(data) {
    return this.http.post(SECTION_URLS.GET_DEFAULT_SECTIONS, data);
  }

  //Add default section
  addDefaultSection(data) {
    return this.http.post(SECTION_URLS.ADD_DEFAULT_SECTIONS, data);
  }

  //Update section status
  changeSectionStatus(data) {
    return this.http.post(SECTION_URLS.UPDATE_STATUS, data);
  }

  //Update section status
  changeDefaultSectionStatus(data) {
    return this.http.post(SECTION_URLS.UPDATE_DEFAULT_STATUS, data);
  }

  setSelectedRole(info) {
    this.mappedSections.next(info);
  }

  updateMappedSections() {
    return this.mappedSections.asObservable();
  }

  // home page - update section display order
  updateSectionOrder(data) {
    return this.http.post(SECTION_URLS.HOME_UPDATE_ORDER, data);
  }

  getSectionDetail(sectionId) {
    return this.http.get(SECTION_URLS.GET_MODULE_BY_ID + sectionId);
  }

  savePersonalizeSection() {
    return this.http.get(SECTION_URLS.PERSONALISE_SECTION);
  }


}
