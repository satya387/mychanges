import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { findIndex, find } from 'lodash';

// Section http call
import { SectionService } from '../../section/section.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { CommonService } from 'src/app/common/common.service';
import { settings } from 'src/app/common/configuration.settings';

declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-add-edit-section',
  templateUrl: './add-edit-section.component.html',
  styleUrls: ['./add-edit-section.component.scss']
})
export class AddEditSectionComponent implements OnInit {

  sectionAction: any;
  isAddSection: any;
  showSectionUrl: any;
  sectionId: any;
  sectionName: any;
  sectionImage: any;
  uploadedImage: any;
  imageUrl: any;
  addSectionForm: FormGroup;
  sectionData: any;
  isResourceSelected: any;
  minLength: any = settings.minLength;
  maxLength: any = settings.maxLength;
  sectionImageUrl: any;
  urlPattern: any = settings.URL_PATTERN;
  acceptImageTypes = settings.acceptImageTypes;
  imageTypes;
  files: File[] = [];
  sectionIcon: any;
  sectionImageIcon: any;
  sectionIconUrl: any;

  constructor(private sectionService: SectionService, private toastService: ToastService, private commonService: CommonService,
    private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.showSectionUrl = false;
    this.isResourceSelected = false;
    this.sectionImageIcon = [];
  }

  ngOnInit(): void {
    this.formInitialization();
    this.imageTypes = settings.acceptImageTypes.split(',');
    this.activatedRoute.queryParams.subscribe((params) => {
      this.sectionAction = params.isAdd === "true" ? 'Create New ' : 'Edit ';
      this.isAddSection = params.isAdd;
      if (params.data) {
        this.sectionData = JSON.parse(params.data);
        this.sectionId = parseInt(this.sectionData.moduleId);
      }
      if (params.isAdd !== "true") {
        this.getImageUrl();
        this.getIconUrl();
        this.getSectionData();
      }
    });
  }

  formInitialization(data?) {
    this.addSectionForm = this.formBuilder.group({
      sectionName: [data ? data.moduleName : '', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
      sectionResourceURL: [data ? data.resourceUrl : '', [Validators.pattern(this.urlPattern)]],
    })
  }

  createSection() {
    this.addSectionForm.controls.sectionName.patchValue(this.addSectionForm.value.sectionName.trim())
    if (!this.addSectionForm.value.sectionName) { this.addSectionForm.setErrors({ 'invalid': true }); }
    if (this.addSectionForm.valid) {
      const sectionObject = {
        "moduleId": 0,
        'ModuleName': this.addSectionForm.value.sectionName.toString(),
        'ResourceUrl': this.addSectionForm.value.sectionResourceURL || null,
        'IsResourceSection': this.isResourceSelected || false,
        'sectionFiles': this.sectionImageIcon
      }
      if (this.isAddSection === 'true') {
        sectionObject['IconUrl'] = null;
        sectionObject['ImageUrl'] = null;
        this.sectionService.createSection(sectionObject).subscribe((response: any) => {
          if (response && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.router.navigate(['/section']);
          } else {
            this.toastService.showWarning(response.message, 'Alert');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      } else {
        sectionObject['moduleId'] = this.sectionId;
        sectionObject['IconUrl'] = this.sectionData ? this.sectionData.iconUrl : null;
        sectionObject['ImageUrl'] = this.sectionData ? this.sectionData.imageUrl : null;
        this.sectionService.editSection(sectionObject).subscribe((response: any) => {
          if (response && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            this.router.navigate(['/section']);
          } else {
            this.toastService.showWarning(response.message, 'Alert');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      }
    }
  }

  getImageUrl() {
    const object = {
      "Type": 1,
      "Id": this.sectionId
    }
    this.commonService.getImageUrl(object).subscribe((response: any) => {
      if (response) {
        this.sectionImageUrl = response.data;
        this.imageUrl = new URL(response.data).pathname.split('/').pop();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getIconUrl() {
    const object = {
      "Type": 4,
      "Id": this.sectionId
    }
    this.commonService.getImageUrl(object).subscribe((response: any) => {
      if (response) {
        this.sectionIconUrl = response.data;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  downloadSectionImage() {
    const imgUrl = this.sectionImageUrl;
    const imgName = this.imageUrl;
    FileSaver.saveAs(imgUrl, imgName);
  }

  downloadSectionIcon() {
    const imgUrl = this.sectionIconUrl;
    const imgName = this.sectionData.iconUrl;
    FileSaver.saveAs(imgUrl, imgName);
  }

  getSectionData() {
    this.sectionService.getSectionDetail(this.sectionId).subscribe((response: any) => {
      if (response) {
        this.sectionData = response;
        this.isResourceSelected = this.sectionData.isResourceSection;
        this.showSectionUrl = this.sectionData.isResourceSection;
        this.formInitialization(this.sectionData);
        // this.sectionImageIcon.push({
        //   fileName: this.sectionData.iconUrl || null,
        //   base64File: null,
        //   fileType: 'ICON'
        // });
        // this.sectionImageIcon.push({
        //   fileName: this.sectionData.imageUrl || null,
        //   base64File: null,
        //   fileType: 'IMAGE'
        // });
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getSelectedImage(event) {
    if (event.File || event.file) {
      this.uploadedImage = event.File || event.file;
      const sectionImages = find(this.sectionImageIcon, { 'fileType': this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE' })
      if (sectionImages) {
        sectionImages.fileName = this.uploadedImage.name;
        sectionImages.base64File = this.uploadedImage.base64Image;
        sectionImages.fileType = this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE';
      } else {
        this.sectionImageIcon.push({
          fileName: this.uploadedImage.name || null,
          base64File: this.uploadedImage.base64Image,
          fileType: this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE'
        });
      }
      if (this.uploadedImage.isAddIcon) {
        this.sectionData.iconUrl = this.uploadedImage.name
      } else if (!this.uploadedImage.isAddIcon) {
        this.sectionData.imageUrl = this.uploadedImage.name
      }
    } else if (!event.File) {
      this.sectionImageIcon.splice(findIndex(this.sectionImageIcon, { 'fileType': event.type.toUpperCase() }), 1);
      if (event.type === 'image') { this.sectionData.imageUrl = null; }
      else if (event.type === 'icon') { this.sectionData.iconUrl = null; }
    }
  }

  onSelectURL(event) {
    this.showSectionUrl = event.target.checked;
    this.isResourceSelected = event.target.checked;
    if (this.showSectionUrl) {
      this.addSectionForm.controls['sectionResourceURL'].setValidators([Validators.required]);
      this.addSectionForm.setErrors({ 'invalid': true });
    } else {
      this.addSectionForm.controls['sectionResourceURL'].clearValidators();
      this.addSectionForm.controls['sectionResourceURL'].reset();
    }
  }

}
