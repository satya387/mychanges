import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { findIndex, find } from 'lodash';

// Section http call
import { TilesService } from '../tiles.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { settings } from 'src/app/common/configuration.settings';

declare var require: any
const FileSaver = require('file-saver');
export interface ITileObject {
  tileId: number;
  name: String;
  DisplayText: String;
  Link: String;
  TileImageUrl: String;
  imageUrl: String;
  iconUrl: String;
  iconUrlName: String;
  downloadImageUrl: String;
  downloadIconUrl: String;
}

export const tileObject = {
  tileId: 0,
  name: null,
  DisplayText: null,
  Link: null,
  TileImageUrl: null,
  imageUrl: null,
  iconUrl: null,
  iconUrlName: null,
  downloadImageUrl: null,
  downloadIconUrl: null
}

@Component({
  selector: 'app-add-edit-tiles',
  templateUrl: './add-edit-tiles.component.html',
  styleUrls: ['./add-edit-tiles.component.scss']
})
export class AddEditTilesComponent implements OnInit {

  tileDescription: any;
  tileAction: any;
  isAddTile: any;
  uploadedImage: any;
  tileUrlPattern: any = settings.link_pattern;
  tileDetail: ITileObject = tileObject;
  addTileForm: FormGroup;
  minLength: any = settings.minLength;
  maxLength: any = settings.maxLength;
  urlPattern: any = settings.URL_PATTERN;
  tileIcon: any;
  tileImageIcon: any;
  tileIconUrl: any;

  constructor(private tileService: TilesService, private toastService: ToastService,
    private router: Router, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.tileImageIcon = [];
  }

  ngOnInit(): void {
    this.formInitialization();
    this.addTileForm.reset();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.tileAction = params.isAdd === "true" ? 'Create New ' : 'Edit ';
      this.isAddTile = params.isAdd;
      if (params.data) {
        this.tileDetail = JSON.parse(params.data);
      }
      if (params.isAdd !== "true") {
        this.getTileDetail();
      }
    });
  }

  formInitialization(data?) {
    this.addTileForm = this.formBuilder.group({
      tileName: [data ? data.name : null, [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
      DisplayText: [data ? data.DisplayText : null],
      tileLink: [data ? data.Link : null, [Validators.pattern(this.urlPattern)]]
    })
  }

  createTile() {
    this.addTileForm.controls.tileName.patchValue(this.addTileForm.value.tileName.trim())
    if (!this.addTileForm.value.tileName) { this.addTileForm.setErrors({ 'invalid': true }); }
    if (this.addTileForm.valid) {
      const tileObject = {
        'Name': this.addTileForm.value.tileName.toString(),
        'DisplayText': this.addTileForm.value.DisplayText || null,
        'TileLink': this.addTileForm.value.tileLink || null,
        'TileFiles': this.tileImageIcon
      }
      tileObject['TileId'] = this.isAddTile === 'true' ? 0 : this.tileDetail.tileId;
      tileObject['IconUrl'] = this.isAddTile === 'true' ? null : this.tileDetail ? this.tileDetail.iconUrl : null;
      tileObject['ImageUrl'] = this.isAddTile === 'true' ? null : this.tileDetail ? this.tileDetail.imageUrl : null;
      this.tileService.createTiles(tileObject).subscribe((response: any) => {
        if (!response.isError) {
          this.toastService.showSuccess(response.message, 'Success');
          this.router.navigate(['/tiles']);
        } else if (response.isError) {
          this.toastService.showError(response.message, 'Error');
          return;
        }
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    }
  }

  getTileDetail() {
    this.tileService.getTileData(this.tileDetail.tileId).subscribe((response: any) => {
      if (response) {
        this.tileDetail = response.data;
        const parseData = JSON.parse(response.data.configuration);
        this.tileDetail.downloadImageUrl = parseData.TileImageUrl;
        this.tileDetail.downloadIconUrl = parseData.TileIconUrl;
        this.tileDetail.iconUrlName = parseData.TileIconUrl ? new URL(parseData.TileIconUrl).pathname.split('/').pop() : null;
        this.tileDetail.TileImageUrl = parseData.TileImageUrl ? new URL(parseData.TileImageUrl).pathname.split('/').pop() : null;
        this.tileDetail.Link = parseData.Link;
        this.tileDetail.DisplayText = parseData.DisplayText;
        this.formInitialization(this.tileDetail);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  downloadSectionImage() {
    const imgUrl = this.tileDetail.downloadImageUrl;
    const imgName = this.tileDetail.TileImageUrl;
    FileSaver.saveAs(imgUrl, imgName);
  }

  downloadTileIcon() {
    const imgUrl = this.tileDetail.downloadIconUrl;
    const imgName = this.tileDetail.iconUrlName;
    FileSaver.saveAs(imgUrl, imgName);
  }

  getSelectedImage(event) {
    // this.uploadedImage = event.File || event.file;
    if (event.File || event.file) {
      this.uploadedImage = event.File || event.file;
      const sectionImages = find(this.tileImageIcon, { 'fileType': this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE' })
      if (sectionImages) {
        sectionImages.fileName = this.uploadedImage.name;
        sectionImages.base64File = this.uploadedImage.base64Image;
        sectionImages.fileType = this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE';
      } else {
        this.tileImageIcon.push({
          fileName: this.uploadedImage.name,
          base64File: this.uploadedImage.base64Image,
          fileType: this.uploadedImage.isAddIcon ? 'ICON' : 'IMAGE'
        });
      }
      if (this.uploadedImage.isAddIcon) {
        this.tileDetail.iconUrl = this.uploadedImage.name
      } else if (!this.uploadedImage.isAddIcon) {
        this.tileDetail.imageUrl = this.uploadedImage.name
      }
    } else if (!event.File) {
      this.tileImageIcon.splice(findIndex(this.tileImageIcon, { 'fileType': event.type.toUpperCase() }), 1)
      if (event.type === 'image') { this.tileDetail.imageUrl = null; }
      else if (event.type === 'icon') { this.tileDetail.iconUrl = null; }
    }
  }
}
