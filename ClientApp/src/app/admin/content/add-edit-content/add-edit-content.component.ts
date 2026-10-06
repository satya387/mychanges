import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
//import * as customBuild from '../../../'
import * as customBuild from 'customCKEditor/build/ckeditor';
import { forEach, indexOf, find, map, remove } from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Section http call
import { ToastService } from 'src/app/common/toast/toast.service';
import { CommonService } from 'src/app/common/common.service';
import { ContentService } from '../content.service';
import { Image_Dimensions, settings } from 'src/app/common/configuration.settings';
import { ContentRoutingModule } from '../content-routing.module';

declare var require: any
const FileSaver = require('file-saver');
export interface IContentObject {
  contentId: number;
  name: String;
  pageContent: String;
  contentImage: String;
}

export const contentObject = {
  contentId: 0,
  name: null,
  pageContent: null,
  contentImage: null
}

@Component({
  selector: 'app-add-edit-content',
  templateUrl: './add-edit-content.component.html',
  styleUrls: ['./add-edit-content.component.scss']
})
export class AddEditContentComponent implements OnInit {

  // public Editor = ClassicEditor;
  public Editor = customBuild;

  contentAction: any;
  isAddContent: any;
  public editorData: any;
  sectionImage: any;
  uploadedImage: any;
  contentDetail: IContentObject = contentObject;
  isDataPublished: boolean;
  imageAspects: any = Image_Dimensions;
  files: any = [];
  contentFilesArray: any = [];
  addContentForm: FormGroup;
  minLength: any = settings.minLength;
  maxLength: any = settings.maxLength;
  contentImageUrl: any;
  imageFiles: any = [];
  currentImageFile: any;
  countryList:any;
 

  constructor(private contentService: ContentService, private toastService: ToastService, private commonService: CommonService,
    private router: Router, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.resetFields();
    this.formInitialization();
    this.onSelectCountry();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.contentAction = params.isAdd === "true" ? 'Create New ' : 'Edit ';
      this.isAddContent = params.isAdd;
      if (params.data) {
        this.contentDetail = JSON.parse(params.data);
      }
    });
    if (this.isAddContent !== "true") {
      this.getContentDetail();
    }
  }

  formInitialization(data?) {
    this.addContentForm = this.formBuilder.group({
      contentName: [data ? data.name : null, [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
      pageContent: [data ? data.pageContent : null],
      //location: [ null, [Validators.required]],
      location: [data ? data.location : null, [Validators.required]],
     
    })
  }

// //country list dropdown
// onSelectCountry(){
//  this.contentService.getCountryDrop().subscribe(response =>{
//   this.countryList=response;
  
//  })
// }

//country list dropdown
onSelectCountry() {
  this.contentService.getCountryDrop().subscribe((response: any) => {
    if (response) {
      this.countryList = response;
    }
  }, (error: any) => {
    this.toastService.showError(error, 'Error');
  })
}


  getContentDetail() {
    this.contentService.getContentData(this.contentDetail.contentId).subscribe((response: any) => {
      if (response) {
        this.contentDetail = response.data;
        this.contentDetail.contentImage = JSON.parse(response.data.bannerImageUrl);
        map(this.contentDetail.contentImage, (img) => {
          img.Base64File = null;
          img.name = img.ImageUrl;
          img.orientation = img.Orientation;
          img['width'] = find(this.imageAspects, { 'orientation': img.Orientation }).width;
          img['height'] = find(this.imageAspects, { 'orientation': img.Orientation }).height;
          this.contentFilesArray.push({
            FileName: img.ImageUrl,
            Base64File: null,
            Orientation: img.Orientation
          });
        });
        this.files = this.contentDetail.contentImage;
        this.formInitialization(this.contentDetail);
      } else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  createContent() {
    // console.log(this.addContentForm.value)
    // debugger
    this.addContentForm.controls.contentName.patchValue(this.addContentForm.value.contentName.trim())
    if(!this.addContentForm.value.contentName) { this.addContentForm.setErrors({ 'invalid': true }); }
    const errorInFile = map(this.files, (file) => {
      if (!file.hasOwnProperty('orientation')) {
        file.showError = true;
      }
      return file.showError === true;
    })
    if (this.files && this.files.length !== 4) {
      this.toastService.showWarning('Please upload 4 images', 'Alert');
      return;
    } else if (errorInFile.includes(true)) {
      this.toastService.showWarning('Selection does not match the image dimensions', 'Alert');
      return;
    }
    else {
      const contentObject = {
        'Name': this.addContentForm.value.contentName.toString(),
        'ContentId': this.isAddContent === 'true' ? 0 : this.contentDetail.contentId,
        'pageContent': this.addContentForm.value.pageContent.toString(),
        'ContentFiles': this.contentFilesArray,
        'Location':this.addContentForm.value.location.toString()
      }
      this.contentService.createContent(contentObject).subscribe((response: any) => {
        if (response && !response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
          this.router.navigate(['/content']);
        } else {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  removeTemporaryObject(files) {
    forEach(files, (items) => {
      delete items.height;
      delete items.width;
      delete items.orientation;
      delete items.showError;
    })
  }

  downloadContentImage(data) {
    const imgUrl = this.contentImageUrl;
    const imgName = data.name;
    FileSaver.saveAs(imgUrl, imgName);
  }

  getImageUrl(data) {
    const object = {
      "Type": 3,
      "Id": this.contentDetail.contentId,
      "orientation": data.orientation
    }
    this.commonService.getImageUrl(object).subscribe((response: any) => {
      if (response) {
        this.contentImageUrl = response.data;
        this.downloadContentImage(data);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getSelectedImage(event) {
    this.uploadedImage = event;
    this.contentDetail.contentImage = event.name;
  }

  publishData() {
    this.isDataPublished = true;
  }

  imageValidation(files) {
    if (this.files.length === 0 && files.length < 4) {
      this.toastService.showWarning('Please upload 4 images', 'Alert');
      return false;
    } else if (this.files.length === 0 && files.length === 4) { this.files = files; return true; }
    else if (this.files.length === 4) {
      this.toastService.showWarning('Delete exiting images and upload again!', 'Alert');
      return false;
    } else if ((this.files.length + files.length) !== 4) {
      this.toastService.showWarning('You still need to upload ' + (4 - this.files.length) + ' images', 'Alert');
      return false;
    } else {
      this.files = this.files.concat(files);
      return true;
    }
  }

  onSelectFile(event: any, selectMode) {
    const selectedFiles = selectMode === 'drop' ? event.addedFiles : event.target.files;
    this.imageFiles = Array.from(selectedFiles);
    const checkValidation = this.imageValidation(this.imageFiles);
    if (checkValidation) {
      if (this.files && this.files.length) {
        this.contentFilesArray = [];
        forEach(this.files, (file) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = ((data: any) => {
            const image = new Image();
            image.src = data.target.result;
            image.onload = () => {
              file['width'] = image.width;
              file['height'] = image.height;
              file['showError'] = false;
            };
            this.contentFilesArray.push({
              FileName: file.name,
              Base64File: data.target.result,
              Orientation: file.orientation ? file.orientation : null
            });
          });
        })
      }
    }
  }

  onChangeImage(event: any) {
    const imageFiles = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(imageFiles);
    reader.onload = ((data: any) => {
      const image = new Image();
      image.src = data.target.result;
      image.onload = () => {
        imageFiles['width'] = image.width;
        imageFiles['height'] = image.height;
        imageFiles['showError'] = false;
      };
      const updateFile = find(this.contentFilesArray, { 'FileName': this.currentImageFile.name });
      updateFile.FileName = imageFiles.name;
      updateFile.Base64File = data.target.result.toString();
      updateFile.Orientation = null;
    });
    this.files.push(imageFiles);
    this.getFileIndex(this.currentImageFile);
  }

  getCurrentImage(file) {
    this.currentImageFile = file;
  }

  deleteFile(file) {
    this.getFileIndex(file);
    remove(this.contentFilesArray, { 'FileName': file.name });
  }

  getFileIndex(file) {
    const index = indexOf(this.files, file, 0);
    this.files = Array.from(this.files);
    this.files.splice(index, 1);
  }

  selectOrientation(event, file) {
    file.showError = false;
    const dimension = find(this.imageAspects, { 'orientation': event.target.value });
    file['orientation'] = event.target.value;
    const findFileObject = find(this.contentFilesArray, { 'FileName': file.name });
    findFileObject['Orientation'] = event.target.value;
    if ((dimension.width !== file.width) || (dimension.height !== file.height)) {
      file.showError = true;
      return;
    }
  }

  resetFields() {
    this.contentDetail = {
      contentId: 0,
      name: null,
      pageContent: null,
      contentImage: null
    }
  }

}
