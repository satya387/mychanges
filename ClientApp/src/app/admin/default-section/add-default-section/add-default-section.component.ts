import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map,filter } from 'lodash';

import { CommonService } from 'src/app/common/common.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { SectionService } from '../../section/section.service';

@Component({
  selector: 'app-add-default-section',
  templateUrl: './add-default-section.component.html',
  styleUrls: ['./add-default-section.component.scss']
})
export class AddDefaultSectionComponent implements OnInit {
  placeHolderText: string;
  sectionList: any;
  selectedSectionList: any;
  isSectionSelected: any;


  constructor(private toastService: ToastService,  private commonService: CommonService,
    private sectionService: SectionService, private router: Router) {
    this.placeHolderText = 'Select the Section Name from the drop down';
    this.selectedSectionList = [];
    this.isSectionSelected = false;
  }

  ngOnInit(): void {
    this.getAllSections();
  }


  getAllSections() {
    this.sectionService.getAllSections().subscribe((response: any) => {
      if (response) {
        this.sectionList = response;
        let sections =  filter(this.sectionList, { 'isActive': true });
        this.sectionList = sections;
        this.commonService.modifyResponseObject(this.sectionList, 'moduleId', 'moduleName');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  addDefaultSections() {
    const object = {
      "moduleId" : map(this.selectedSectionList, 'moduleId'),
      "isDefault": true,
      "isCreated": true
    }
    this.sectionService.addDefaultSection(object).subscribe((response: any) => {
      if (response && !response.isError) {
        this.toastService.showSuccess('Sections added to Default Section!', 'Success');
        this.router.navigate(['/default-section']);
      } else if (response.isError) {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
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
