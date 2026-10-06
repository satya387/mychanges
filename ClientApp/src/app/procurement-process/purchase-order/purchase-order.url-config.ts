import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const ARC_BASE_URL = environment.arcBaseUrl;

export const PO_URLS = {
  PO_LIST: BASE_URL + 'ProcurementProcess/GetAllPODetails',
  CREATE_PO: BASE_URL + 'ProcurementProcess/CreatePurchaseOrder/',
  POEditDetails:BASE_URL + 'ProcurementProcess/GetPOEditDetails?Id=',
  UPDATE_PO:BASE_URL + 'ProcurementProcess/updatePODetails/',
  UPDATE_Tax:BASE_URL + 'ProcurementProcess/updateTaxDetails/',
  REJECT_PR_STATUS : BASE_URL + 'ProcurementProcess/RejectPurchaseOrder' ,
  PR_Details:BASE_URL + 'ProcurementProcess/GetPRDetails?Id=',
  PR_Numbers: BASE_URL + 'ProcurementProcess/GetPRNumbers',
  GET_POFile:BASE_URL + 'ProcurementProcess/GetPOFile',
  DOWNLOAD_PDF: BASE_URL + 'ProcurementProcess/GetPurchaseOrderReport',
  UPLOAD_PDF: ARC_BASE_URL + 'PurchaseOrder/SharepointUpload',
  UPLOAD_SP_FILES:BASE_URL + 'ProcurementProcess/SupportDoc',
  Download_Doc: BASE_URL + 'ProcurementProcess/Download_Doc',
  POUserPermissions: BASE_URL + 'ProcurementProcess/GetUserPermission?EmpeMidsID=',
  GET_PO_EXCEL_DUMP: BASE_URL + 'ProcurementProcess/GetPOExcelDumpReport',
  UPDATE_PO_STATUS : BASE_URL +'ProcurementProcess/UpdatePurchaseOrderStatus', 

}
