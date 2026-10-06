import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'lodash';

import { TilesService } from '../../tiles/tiles.service';

import { ToastService } from 'src/app/common/toast/toast.service';
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../section.service';
@Component({
  selector: 'app-section-tile',
  templateUrl: './section-tile.component.html',
  styleUrls: ['./section-tile.component.scss']
})
export class SectionTileComponent implements OnInit {

  tilesList: any;
  sectionName: any;
  sectionId: any;
  tilesPlaceHolderText: any;
  selectedTilesList: any;
  isTileSelected: boolean;

  constructor(private toastService: ToastService, private commonService: CommonService, private tileService: TilesService,
    private sectionService: SectionService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.tilesPlaceHolderText = "Select the Tile Name from the drop down";
    this.selectedTilesList = [];
    this.isTileSelected = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const sectionData = JSON.parse(params.data);
      this.sectionId = parseInt(sectionData.moduleId);
      this.sectionName = sectionData.moduleName;
    });
    this.getAllTiles();
    this.getTilesBySection();
  }

  getAllTiles() {
    this.tileService.getTilesList().subscribe((response: any) => {
      if (response) {
        this.tilesList = response;
        this.commonService.modifyResponseObject(this.tilesList, 'tileId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getTilesBySection() {
    this.tileService.getTilesBySectionId(this.sectionId).subscribe((response: any) => {
      if (response) {
        this.selectedTilesList = response;
        this.commonService.modifyResponseObject(this.selectedTilesList, 'tileId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectItem(data) {
    if(data) {
      this.selectedTilesList = data;
      this.isTileSelected = true;
    } else {
      this.isTileSelected = false;
    }
  }

  mapTilesToSection() {
    if (this.selectedTilesList?.length === 0) {
      this.toastService.showWarning('Please select tile from the list!', 'Alert');
      return;
    }
    const object = {
      "ModuleId": this.sectionId,
      "tileId": map(this.selectedTilesList, 'tileId'),
      "IsGlobal" : true
    }
    this.sectionService.assignTilesToSection(object).subscribe((response: any) => {
      if (response.data) {
        // this.toastService.showSuccess(response.message, 'Success');
        this.toastService.showSuccess('Tiles mapped to the section!', 'Success');
        this.router.navigate(['/section']);
      } else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }


}
