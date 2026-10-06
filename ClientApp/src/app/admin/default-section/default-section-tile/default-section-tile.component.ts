import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// lodash library
import { map } from 'lodash';

// Section http call
import { CommonService } from 'src/app/common/common.service';
import { SectionService } from '../../section/section.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { TilesService } from '../../tiles/tiles.service';
@Component({
  selector: 'app-default-section-tile',
  templateUrl: './default-section-tile.component.html',
  styleUrls: ['./default-section-tile.component.scss']
})
export class DefaultSectionTileComponent implements OnInit {

  placeHolderText: string;
  tilesList: any;
  selectedTilesList: any;
  sectionName:any;
  sectionId:any;
  isTileSelected: boolean;

  constructor(private sectionService: SectionService, private toastService: ToastService, private commonService: CommonService,
    private tileService: TilesService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.placeHolderText = 'Select the Tile Name from the drop down';
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

  mapTilesToSection() {
    const object = {
      "ModuleId": this.sectionId,
      "tileId": map(this.selectedTilesList, 'tileId'),
      "IsGlobal" : true
    }
    this.sectionService.assignTilesToSection(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess('Tiles mapped to the section!', 'Success');
        this.router.navigate(['/default-section']);
      } else {
        this.toastService.showError(response.message, 'Error');
        return;
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

}
