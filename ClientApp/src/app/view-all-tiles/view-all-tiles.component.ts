import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { find, map } from 'lodash';

import { SectionService } from 'src/app/admin/section/section.service';
import { TilesService } from 'src/app/admin/tiles/tiles.service';
import { ToastService } from 'src/app/common/toast/toast.service';
@Component({
  selector: 'app-view-all-tiles',
  templateUrl: './view-all-tiles.component.html',
  styleUrls: ['./view-all-tiles.component.scss']
})
export class ViewAllTilesComponent implements OnInit {

  showAllTiles:any;
  tileDetail: any;
  userDetail: any;
  tileDisplayOrder: any = [];

  constructor(private tileService: TilesService, private toastService: ToastService,
    private sectionService: SectionService, private route: Router) {
      this.tileDisplayOrder = [];
  }

  ngOnInit(): void {
    this.tileDetail = this.tileService.viewAllTileDetail;
    this.userDetail = JSON.parse(sessionStorage.getItem('userDetail'));
  }

  backToList(){
    this.route.navigate(['/home']);
  }

  statusToggleTile(data) {
    const object = {
      "TileId": data.tileId,
      "isActive": data.isActive ? false : true,
    };
    this.tileService.changeTileStatusUser(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
        // this.onChangeStatusAndOrder.emit(this.userDetail.UserId);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  updateTileDisplayOrder(event, data) {
    const updatedOrder = parseInt(event.target.value);
    const object = {
      "TileId": parseInt(data.tileId),
      "Order": updatedOrder,
      "isActive": data.isActive,
    };
    if (this.tileDisplayOrder.length) {
      const checkIfExists = find(this.tileDisplayOrder, { "TileId": data.tileId });
      if (checkIfExists) {
        checkIfExists.Order = updatedOrder;
        checkIfExists.isActive = data.isActive;
      } else {
        this.tileDisplayOrder.push(object);
      }
    } else {
      this.tileDisplayOrder.push(object);
    }
    data.displayOrder = parseInt(data.displayOrder);
  }

  checkDuplicateDisplayOrder(dataList) {
    let isOrderExists;
    if (dataList && dataList.length) {
      const getOrders = map(dataList, 'displayOrder');
      isOrderExists = getOrders.filter((element, index, array) => array.indexOf(element) !== index);
    }
    return isOrderExists;
  }

  savePersonalizedTiles(sectionData) {
    if (sectionData && sectionData.tilesList.length) {
      const checkDisplayOrder = this.checkDuplicateDisplayOrder(sectionData.tilesList);
      if (checkDisplayOrder.length) {
        this.toastService.showWarning('Same order number cannot be given to different tiles', 'Alert');
        return;
      }
    }
    const dataObj = {
      "UserId": parseInt(this.userDetail.UserId),
      "ModuleId": sectionData.sectionId,
      "TilesDisplayOrders": this.tileDisplayOrder
    }
    this.tileService.updateTileOrder(dataObj).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
        this.getTilesBySection(sectionData);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  getTilesBySection(data) {
    // getTilesBySectionId
    this.tileService.getTilesAndSectionsByUserId(data.sectionId).subscribe((response: any) => {
      if (response) {
        this.tileDetail.tilesList = response;
        this.modifyTilesList();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  modifyTilesList() {
    this.tileDetail.tilesList.forEach(data => {
      if (parseInt(data.tileTypeId) === 1) {
        // static url
        const parseData = JSON.parse(data.configuration);
        data.tileLink = parseData.Link;
      } else {
        // token based tile
      }
    });
  }

}
