import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { filter, find, map } from 'lodash';
import { SectionService } from 'src/app/admin/section/section.service';
import { TilesService } from 'src/app/admin/tiles/tiles.service';
import { TILE_INFO } from 'src/app/common/static-tile-info.settings';
import { ToastService } from 'src/app/common/toast/toast.service';
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  sectionDataList: any;
  selectedSection: any;
  dataList: any;
  activeSectionDataList: any;
  sectionPersonalized: any;
  tilesPersonalized: any;
  activeTilesList: any;
  sectionData: any;
  previousIndex: any;
  sectionDisplayOrder: any = [];
  tileDisplayOrder: any = [];
  staticTileList: any = TILE_INFO;
  bookmarkList:any[] = [];

  @Input()
  set sectionList(data) {
    if (data) {
      this.sectionDataList = data;
      this.updateSectionList(this.sectionDataList);
    }
  }
  @Input()
  set activeSectionList(data) {
    if (data) {
      this.activeSectionDataList = data;
      this.dataList = this.activeSectionDataList;
      this.updateSectionList(this.dataList);
      this.userDetail = JSON.parse(sessionStorage.getItem('userDetail'));
      this.getBookmarkDetails();
      //this.dataList = this.dataList.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    }
  }
  @Input()
  set isPersonalized(param) {
    this.sectionPersonalized = param;
    this.dataList = param ? this.sectionDataList : this.activeSectionDataList;
    this.updateSectionList(this.dataList);
  }
  @Output() onChangeStatusAndOrder: EventEmitter<string> = new EventEmitter<string>();
  tilesList: any;
  showTiles: any;
  userDetail: any;
  @Input() moduleSearchText: string = "";
  @Input() showOnlyBookmark: boolean = false;
  @Input() showBookmark: number = 0;
  
  constructor(private tileService: TilesService, private toastService: ToastService,
    private sectionService: SectionService, private router: Router) {
    this.showTiles = false;
    this.tilesPersonalized = false;
    this.sectionDisplayOrder = [];
    this.tileDisplayOrder = [];
  }

  ngOnInit(): void {
    //this.getBookmarkDetails();
  }

  updateSectionList(dataList) {
    let defaultSectionArray = [], nonDefaultSection = [];
    if (dataList && dataList.length) {
      dataList.forEach(element => {
        if (!element.displayOrder && element.isDefault) {
          defaultSectionArray.push(element);
        } else {
          nonDefaultSection.push(element);
        }
      });
      nonDefaultSection = nonDefaultSection.concat(defaultSectionArray);
    }
    this.dataList = nonDefaultSection;

    //this.dataList = this.dataList.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
    console.log(1, this.dataList);
    this.makePinnedModuleAtTop();
  }

  showAssignedTiles(data, index) {
    if (this.previousIndex || this.previousIndex === 0) {
      this.dataList[this.previousIndex].activeTilesList = [];
      this.dataList[this.previousIndex].showTiles = false;
    }
    this.previousIndex = index;
    this.showTiles = !this.showTiles;
    this.tilesPersonalized = this.sectionPersonalized ? true : false;
    this.activeTilesList = [];
    this.selectedSection = this.showTiles ? data.moduleName : undefined;
    if (this.showTiles) {
      this.getTilesBySection(data);
    }
  }

  getTilesBySection(data) {
    this.tileService.getTilesAndSectionsByUserId(data.moduleId).subscribe((response: any) => {
      if (response) {
        this.tilesList = response;
        this.activeTilesList = this.tilesPersonalized ? this.tilesList : filter(this.tilesList, { 'isActive': true });
        data.activeTilesList = this.activeTilesList;
        data.showTiles = this.showTiles;
        this.modifyTilesList();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  modifyTilesList() {
    this.activeTilesList.forEach(data => {
      if (parseInt(data.tileTypeId) === 1) {
        // static url
        const parseData = JSON.parse(data.configuration);
        data.tileLink = parseData.Link;
      } else {
        // token based tile
      }
    });
  }

  statusToggle(data) {
    if(data.isDefault){
      this.toastService.showWarning("Module is default and cannot be turn inactive", 'warning');
      return;
    }
    const object = {
      "ModuleId": data.moduleId,
      "isActive": data.isActive ? false : true,
    };
    this.sectionService.changeSectionStatus(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  statusToggleTile(data) {
    const object = {
      "TileId": data.tileId,
      "isActive": data.isActive ? false : true,
    };
    this.tileService.changeTileStatusUser(object).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
      } else {
        this.toastService.showError(response.message, 'error');
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  updateDisplayOrder(event, data) {
    const updatedOrder = parseInt(event.target.value);
    const object = {
      "ModuleId": data.moduleId,
      "Order": updatedOrder,
      "isActive": data.isActive,
    };
    if (this.sectionDisplayOrder.length) {
      const checkIfExists = find(this.sectionDisplayOrder, { "ModuleId": data.moduleId });
      if (checkIfExists) {
        checkIfExists.Order = updatedOrder;
        checkIfExists.isActive = data.isActive;
      } else {
        this.sectionDisplayOrder.push(object);
      }
    } else {
      this.sectionDisplayOrder.push(object);
    }
    data.displayOrder = parseInt(data.displayOrder);
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
    //this.getBookmarkDetails();
  }

  checkDuplicateDisplayOrder(dataList) {
    let isOrderExists;
    if (dataList && dataList.length) {
      const getOrders = map(dataList, 'displayOrder');
      isOrderExists = getOrders.filter((element, index, array) => element > 0 && array.indexOf(element) !== index);
    }
    return isOrderExists;
  }

  savePersonalizedSection() {
    if (this.dataList && this.dataList.length) {
      const checkDisplayOrder = this.checkDuplicateDisplayOrder(this.dataList);
      if (checkDisplayOrder.length) {
        this.toastService.showWarning('Same order number cannot be given to different sections', 'Alert');
        return;
      }
    }
    const dataObj = {
      "UserId": parseInt(this.userDetail.UserId),
      "ModuleDisplayOrders": this.sectionDisplayOrder
    }
    this.sectionService.updateSectionOrder(dataObj).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
        this.onChangeStatusAndOrder.emit(this.userDetail.UserId);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  cancelPersonalizedSection() {
    this.sectionPersonalized = false;
    this.tilesPersonalized = false;
    this.onChangeStatusAndOrder.emit(null);
    window.location.reload();
  }

  personalizeTiles(data, index) {
    this.tileService.savePersonalizeTile(data.moduleId).subscribe((response: any) => {
      if (response) {
        this.sectionData = data;
        this.tilesPersonalized = true;
        this.showAssignedTiles(data, index);
      }
    })
  }

  savePersonalizedTiles(sectionData) {
    if (sectionData && sectionData.activeTilesList.length) {
      const checkDisplayOrder = this.checkDuplicateDisplayOrder(sectionData.activeTilesList);
      if (checkDisplayOrder.length) {
        this.toastService.showWarning('Same order number cannot be given to different tiles', 'Alert');
        return;
      }
    }
    const dataObj = {
      "UserId": parseInt(this.userDetail.UserId),
      "ModuleId": sectionData.moduleId,
      "TilesDisplayOrders": this.tileDisplayOrder
    }
    this.tileService.updateTileOrder(dataObj).subscribe((response: any) => {
      if (response.data) {
        this.toastService.showSuccess(response.message, 'Success');
        this.showTiles = false;
        this.selectedSection = undefined;
        sectionData.showTiles = true;
        sectionData.activeTilesList = [];
        this.onChangeStatusAndOrder.emit(this.userDetail.UserId);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onPinIconClick(item: any, event) {
    event.stopPropagation();
    item.isPinned = !item.isPinned;
    let dataObj = {
      "UserId": parseInt(this.userDetail.UserId),
      "ModuleId": item.moduleId,
      "IsPinned": item.isPinned
    }
    this.tileService.pinModule(dataObj).subscribe((response: any) => {
      if (response.data) {
        if(dataObj.IsPinned === true) {
          this.toastService.showSuccess('Pinned Module Successfully', 'Success');
        } else{
          this.toastService.showSuccess('Unpinned Module Successfully','Success');
        }
        

        this.makePinnedModuleAtTop();
        console.log(this.dataList);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  makePinnedModuleAtTop() {
    let pinnedArray = [], nonPinnedArray = [];
    if (this.dataList && this.dataList.length) {
      this.dataList.forEach(element => {
        if (element.isPinned === true ) {
          pinnedArray.push(element);
        } else {
          nonPinnedArray.push(element);
        }
      });
      pinnedArray = pinnedArray.sort((a,b) => a.displayOrder - b.displayOrder);
      nonPinnedArray = nonPinnedArray.sort((a,b) => a.displayOrder - b.displayOrder);

      pinnedArray = pinnedArray.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
      nonPinnedArray = nonPinnedArray.sort((a, b) => a.moduleName.localeCompare(b.moduleName));

      pinnedArray = pinnedArray.concat(nonPinnedArray);
    }
    this.dataList = pinnedArray;
    //this.dataList = this.dataList.sort((a, b) => a.moduleName.localeCompare(b.moduleName));

  }

  navigateToViewAll(sectionData) {
    this.tileService.viewAllTileDetail = { 'sectionName': this.selectedSection, 'sectionId': sectionData.moduleId, 'tilesList': this.activeTilesList, 'isTilesPersonalised': this.tilesPersonalized }
    this.router.navigate(['/view-all-tile']);
  }

  redirectSectionUrl(data) {
    if (data.isResourceSection) {
      const rrSection = find(this.staticTileList, { tileCode: 'TL0053' });
      if (data.resourceCode === rrSection.tileCode) {
        this.router.navigate(['request-resource']);
      } else {
        window.open(data.resourceUrl, '_blank');
      }
    }
  }

  openTileUrl(data) {
    window.open(data.tileLink, '_blank');
  }

  closeTiles(sectionData) {
    this.showTiles = !this.showTiles;
    this.selectedSection = undefined;
    sectionData.showTiles = true;
    sectionData.activeTilesList = [];
  }

  
getBookmarkDetails() {
  this.userDetail = JSON.parse(sessionStorage.getItem('userDetail'));
  this.tileService.getBookMark(this.userDetail.UserId).subscribe((response: any) => {
    if (response) {
      this.bookmarkList = response;
      localStorage.setItem('bookmarkList', JSON.stringify(this.bookmarkList));
    }
  }, (error: any) => {
    this.toastService.showError(error, 'Error');
  });
}

deleteBookmarkDetails(bookMarkId) {
  this.userDetail = JSON.parse(sessionStorage.getItem('userDetail'));
  this.tileService.deleteBookMark(this.userDetail.UserId, bookMarkId).subscribe((response: any) => {
    if (response.data === true) {
      this.toastService.showSuccess('Bookmark Deleted Successfully', 'Success');
      this.bookmarkList = this.bookmarkList.filter(item => item.bookMarkId !== bookMarkId);
      localStorage.setItem('bookmarkList', JSON.stringify(this.bookmarkList));
    }
    else{
      this.toastService.showError('Unable to delete Bookmark','Error');
    }
  }, (error: any) => {
    this.toastService.showError(error, 'Error');
  });
}




onbookmarkClick(item: any) {
  console.log(item);
  window.open(item.url, "_blank");
}





}
