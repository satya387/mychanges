import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { settings } from 'src/app/common/configuration.settings';
import { ToastService } from 'src/app/common/toast/toast.service';
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {

  acceptImageTypes = settings.acceptImageTypes;
  imageTypes;
  iconImageTypes;
  @Input() addIcon: any;
  @Input() label: any;
  sectionIcon: any;
  @Input()
  set sectionImage(data) {
    if (data) {
      this.imageUrl = data;
    }
  }
  @Input()
  set sectionIconImg(data) {
    if (data) {
      this.sectionIcon = data;
    }
  }
  imageUrl: any;
  imageData: any;
  files: File[] = [];
  @Output() onSelectImage = new EventEmitter<any>();
  @Output() downloadImage = new EventEmitter<any>();

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.iconImageTypes = settings.acceptIconImageTypes.split(',');
    this.imageTypes = settings.acceptImageTypes.split(',');
  }

  onSelectFile(event: any, selectMode) {
    this.files = selectMode === 'drop' ? event.addedFiles : event.target.files;
    if (this.files.length === 1) {
      if (this.imageTypes.indexOf(this.files[0].type) >= 0) {
        if (this.files && this.files.length) {
          const reader = new FileReader();
          reader.readAsDataURL(this.files[0]);
          reader.onload = ((data: any) => {
            const image = new Image();
            image.src = data.target.result;
            image.onload = () => {
              this.imageData = data.target.result;
              this.imageUrl = this.files[0].name;
              this.files[0]['base64Image'] = data.target.result;
              this.files[0]['isAddIcon'] = this.addIcon;
              this.onSelectImage.emit({file: this.files[0]});
            };
          });
        }
      } else {
        this.toastService.showWarning('Please select only image', 'Alert');
        return;
      }
    } else {
      this.toastService.showWarning('You can upload one image', 'Alert');
      return;
    }
  }

  onSelectIconFile(event: any) {
    this.files = event.target.files;
    if (this.files.length === 1) {
      if (this.iconImageTypes.indexOf(this.files[0].type) >= 0) {
        if (this.files && this.files.length) {
          const reader = new FileReader();
          reader.readAsDataURL(this.files[0]);
          reader.onload = ((data: any) => {
            const image = new Image();
            image.src = data.target.result;
            image.onload = () => {
              this.sectionIcon = this.files[0].name;
              this.files[0]['base64Image'] = data.target.result;
              this.files[0]['isAddIcon'] = this.addIcon;
              this.onSelectImage.emit({file: this.files[0]});
            };
          });

        }
      } else {
        this.toastService.showWarning('Please select only icon', 'Alert');
        return;
      }
    } else {
      this.toastService.showWarning('You can upload one image', 'Alert');
      return;
    }
  }

  removeImage(typeOfFile) {
    if (typeOfFile === 'image') {
      this.imageData = null;
      this.imageUrl = null;
      this.onSelectImage.emit({file: null, type: typeOfFile });
    } else if (typeOfFile === 'icon') {
      this.sectionIcon = null;
      this.onSelectImage.emit({file: null, type: typeOfFile });
    }
  }

  imageDownload() {
    this.downloadImage.emit(null);
  }

  iconDownload() {
    this.downloadImage.emit(null);
  }

}
