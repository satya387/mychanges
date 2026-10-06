import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, filter, _ } from 'lodash';

import { ToastService } from 'src/app/common/toast/toast.service';
import { UsersService } from '../../users.service';
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../../../section/section.service';
import { TilesService } from 'src/app/admin/tiles/tiles.service';

@Component({
  selector: 'app-user-tile',
  templateUrl: './user-tile.component.html',
  styleUrls: ['./user-tile.component.scss']
})
export class UserTileComponent implements OnInit {

  userName: any;
  userId: any;
  selectedModule: any;
  tilesPlaceHolderText: any;
  tilesList: any;
  selectedTilesList: any;
  originalSectionTilesList: any;
  selectedSectionTilesList: any;
  isTileSelected: boolean;

  constructor(private toastService: ToastService, private userService: UsersService,
    private commonService: CommonService, private tileService: TilesService,
    private sectionService: SectionService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.tilesPlaceHolderText = "Select the Tile Name from the drop down";
    this.selectedTilesList = [];
    this.isTileSelected = false;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const userData = JSON.parse(params.data);
      this.userName = userData.name;
      this.userId = userData.userId;
    });
    this.getAllTiles();
    this.getMappedSectionsByUser();
  }

  // get all tiles
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

  // get mapped sections & tiles by the user
  getMappedSectionsByUser() {
    this.sectionService.getUserModulesTiles(this.userId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionTilesList = response;
        this.originalSectionTilesList = JSON.parse(JSON.stringify(response));
        this.selectedModule = response[0].moduleId;
        this.selectedTilesList = filter(this.selectedSectionTilesList, { 'moduleId': this.selectedModule })[0].tiles;       
        this.commonService.modifyResponseObject(this.selectedTilesList, 'tileId', 'name');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  saveTiles() {
    let selectModule =  filter(this.selectedSectionTilesList, { 'moduleId': parseInt(this.selectedModule) })[0];
    let tiles = filter(this.originalSectionTilesList, { 'moduleId': parseInt(this.selectedModule) })[0].tiles;
    if(selectModule.isDefault && tiles.length > this.selectedTilesList.length){
      this.toastService.showWarning('Selected module is default and tiles cannot be updated from this screen!', 'Warning');
      return;
    }
    if (this.selectedTilesList?.length === 0 || !this.selectedModule) {
      this.toastService.showWarning('Please select tile from the list!', 'Alert');
      return;
    }
    const object = {
      "UserId": this.userId,
      "ModuleId": parseInt(this.selectedModule),
      "Tiles": map(this.selectedTilesList, 'tileId')
    }
    this.userService.saveTilesToUser(object).subscribe((response: any) => {
      if (response) {
        // this.toastService.showSuccess(response.message, 'Success');
        this.toastService.showSuccess('Tiles mapped to the user!', 'Success');
        this.router.navigate(['/users']);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectSection(event) {
    this.selectedTilesList = filter(this.selectedSectionTilesList, { 'moduleId': parseInt(this.selectedModule) })[0].tiles;
    this.commonService.modifyResponseObject(this.selectedTilesList, 'tileId', 'name');
  }

  onSelectItem(data) {
    if(data) {
      this.selectedTilesList = data;
      this.isTileSelected = true;
    } else {
      this.isTileSelected = false;
    }
  }

}
