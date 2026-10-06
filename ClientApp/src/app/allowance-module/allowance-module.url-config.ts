import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const ARC_BASE_URL = environment.arcBaseUrl;

export const ALLOWANCE_URLS = {
  ALLOWANCE_ACCESS_BY_EMPID: BASE_URL + 'Allowance/GetAllowanceAccessByEmpId',
  ALLOWANCE_DETAILS: BASE_URL + 'Allowance/GetAllowanceDetails',
  PROJECT_LIST: BASE_URL + 'Allowance/GetProjectList',
  EMPLOYEE_LIST: BASE_URL + 'Allowance/GetEmployeeList?ProjId=',
  SHIFT_TYPE_LIST:  BASE_URL + 'Allowance/GetShiftTypeList',
  CREATE_ALLOWANCES: BASE_URL + 'Allowance/CreateUpdateAllowanceDetail/',
  UPDATE_STATUS: BASE_URL + 'Allowance/UpdateAllowanceStatus/',

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
