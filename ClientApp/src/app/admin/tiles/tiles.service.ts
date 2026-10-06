import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { TILE_URLS } from './tiles.url-config';

@Injectable({
  providedIn: 'root'
})
export class TilesService {
  viewAllTileDetail: any;

  constructor(private http: HttpClient) { }

  getTilesList() {
    return this.http.get(TILE_URLS.GET_ALL_TILES);
  }

  getTilesBySectionId(sectionId) {
    return this.http.get(TILE_URLS.GET_TILES_BY_SECTION_ID + sectionId);
  }

  getTilesAndSectionsByUserId(sectionId) {
    return this.http.get(TILE_URLS.GET_TILES_SECTION_BY_USER + sectionId);
  }

  // get tiles grid data
  getAllTilesList(data) {
    return this.http.post(TILE_URLS.TILES_LIST, data);
  }

  createTiles(data) {
    return this.http.post(TILE_URLS.CREATE_TILES, data);
  }

  // edit Tiles
  editTiles(data) {
    return this.http.post(TILE_URLS.UPDATE_TILES, data);
  }

  // delete Tiles
  deleteTiles(data) {
    return this.http.post(TILE_URLS.DELETE_TILES, data);
  }

  //Update section status
  changeTileStatus(data) {
    return this.http.post(TILE_URLS.UPDATE_STATUS, data);
  }

  //Update section status
  changeTileStatusUser(data) {
    return this.http.post(TILE_URLS.UPDATE_STATUS_USER, data);
  }

  //Get Tile data
  getTileData(tileId) {
    return this.http.get(TILE_URLS.GET_TILE_DATA + tileId);
  }

  //Get Tile data
  savePersonalizeTile(moduleId) {
    return this.http.get(TILE_URLS.PERSONALIZE_TILES + moduleId);
  }

  // home page - update tile display order
  updateTileOrder(data) {
    return this.http.post(TILE_URLS.HOME_UPDATE_ORDER, data);
  }

  pinModule(data) {
    return this.http.post(TILE_URLS.PIN_MODULE, data);
  }

  //bookmark 
  createBookMark(data) {
    return this.http.post(TILE_URLS.CREATE_BOOKMARKS, data);
  }

  getBookMark(data) {
    return this.http.get(TILE_URLS.GETBOOKMARK + data);
  }

  deleteBookMark(userId, bookMarkId) {
    return this.http.delete(TILE_URLS.DELETEBOOKMARK,  {
      body:  {'UserId': userId, 'BookMarkId': bookMarkId}
    });
  }


  

 
}
