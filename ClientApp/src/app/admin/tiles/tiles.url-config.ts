import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const TILE_URLS = {
  GET_ALL_TILES: BASE_URL + 'Tiles/GetAllTiles',
  // CREATE_TILES: BASE_URL + 'Tiles/Create',
  CREATE_TILES: BASE_URL + 'Tiles/CreateTile',
  UPDATE_TILES: BASE_URL + 'Tiles/Update',
  TILES_LIST: BASE_URL + 'Tiles/TilesGridData',
  DELETE_TILES: BASE_URL + 'Tiles/Delete',
  // GET_TILE_DATA: BASE_URL + 'Tiles?TileId=',
  GET_TILE_DATA: BASE_URL + 'Tiles/GetTileById?TileId=',
  GET_TILES_BY_SECTION_ID: BASE_URL + 'Tiles/GetAllTilesByModuleId?moduleId=',
  GET_TILES_SECTION_BY_USER: BASE_URL + 'Tiles/GetAllTilesByModuleIdAndUserId?moduleId=',
  UPDATE_STATUS: BASE_URL + 'Tiles/UpdateTileStatus',
  UPDATE_STATUS_USER: BASE_URL + 'Tiles/UpdateTileStatusForUser',
  HOME_UPDATE_ORDER: BASE_URL + 'Tiles/UpdateDisplayOrder',
  GET_TILE_BY_TILECODE: BASE_URL + 'Tiles/GetTileByTileCode?tileCode=',
  PERSONALIZE_TILES: BASE_URL + 'Tiles/PersonalizeTilesOrder?moduleId=',
  PIN_MODULE: BASE_URL + 'Tiles/PinModule',
  CREATE_BOOKMARKS: BASE_URL + 'BookMark/Create',
  GETBOOKMARK: BASE_URL + 'BookMark/Get?userId=',
  DELETEBOOKMARK: BASE_URL + 'BookMark/Delete',

}
