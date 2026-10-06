import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
import { UsersService } from '../../admin/users/users.service';
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../../admin/section/section.service';


@Component({
  selector: 'app-user-section',
  templateUrl: './user-section.component.html',
  styleUrls: ['./user-section.component.scss']
})
export class UserSectionComponent implements OnInit {

  @Input() label: any;
  @Input() dataFromDropdown: any;
  userName: any;
  userId: any;
  sectionPlaceHolderText: any;
  sectionList: any;
  selectedSectionList: any;
  mappedSectionsSubscribe$: any;
  isSectionSelected: boolean;

  constructor(private toastService: ToastService, private userService: UsersService, private commonService: CommonService,
    private sectionService: SectionService, private router: Router, private activatedRoute: ActivatedRoute) {

    this.sectionPlaceHolderText = "Select the Section Name from the drop down";
    this.isSectionSelected = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const userData = JSON.parse(params.data);
      this.userName = userData.name;
      this.userId = userData.userId;
    });
    this.getAllSections();
    this.getMappedSectionsByUser();
  }

  // get all sections
  getAllSections() {
    this.sectionService.getAllSections().subscribe((response: any) => {
      if (response) {
        this.sectionList = response;
        this.commonService.modifyResponseObject(this.sectionList, 'moduleId', 'moduleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  // get sections mapped by the user
  getMappedSectionsByUser() {
    this.sectionService.getUserModulesTiles(this.userId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionList = response;
        this.commonService.modifyResponseObject(this.selectedSectionList, 'moduleId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  saveSections() {
    if (this.label === 'user') {
      const object = {
        "UserId": this.userId,
        "Sections": map(this.selectedSectionList, 'moduleId')
      }
      this.userService.saveSectionsToUser(object).subscribe((response: any) => {
        if (response) {
          // this.toastService.showSuccess(response.message, 'Success');
          this.toastService.showSuccess('Sections mapped to the user!', 'Success');
          this.router.navigate(['/users']);
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  onSelectItem(data) {
    if(data) {
      this.selectedSectionList = data;
      this.isSectionSelected = true;
    } else {
      this.isSectionSelected = false;
    }
  }

}
