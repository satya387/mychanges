import {environment} from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;
const CONTROLLER_NAME = 'AssetManagement';

export const AM_URLS = {
    GET_ALL_AM_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetAllAMDetails',
    Save_AM_DETAILS : BASE_URL + CONTROLLER_NAME + '/SaveAssetManagement',
    get_AssetBy_Id : BASE_URL + CONTROLLER_NAME + '/GetAssetById',
    GETAMDETAILS_BYId : BASE_URL + CONTROLLER_NAME + '/GetAssetByName',
    GET_ALL_Asset_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetAssetType',
    GET_ALL_Assginment_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetAllAADetails',
    GET_ALL_Software_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetSoftwareDetailsbyId',
    GET_ALL_Hardware_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetHardwareDetailsbyId',
    get_AssginmentBy_Id : BASE_URL + CONTROLLER_NAME + '/GetAssginmentById',
    Save_AA_DETAILS : BASE_URL + CONTROLLER_NAME + '/SaveAssetAssignment',
    GET_ALL_Device_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetDeviceType',
    get_number : BASE_URL + CONTROLLER_NAME + '/GetAssetNumber?assetName=',
    GET_ALL_Dece_DETAILS : BASE_URL + CONTROLLER_NAME + '/GetDevicesType',
    GETAADETAILS_BYId : BASE_URL + CONTROLLER_NAME + '/GetAssginmentByName',
    get_NAME : BASE_URL + CONTROLLER_NAME + '/GetEmployeeName?employeeName=',
    GETSOFTWAREDETAILS_BYId : BASE_URL + CONTROLLER_NAME + '/GetSoftwareDetailsByName',
    GETHARDWAREDETAILS_BYId : BASE_URL + CONTROLLER_NAME + '/GetHardwareDetailsByName',
    get_EmpId : BASE_URL + CONTROLLER_NAME + '/GetEmployeeId?employeeName=',
    get_namebytype : BASE_URL + CONTROLLER_NAME + '/GetAssetName?devicetype=',
    get_SoftwareBy_Id : BASE_URL + CONTROLLER_NAME + '/GetSoftwareById',
    get_HardwareBy_Id : BASE_URL + CONTROLLER_NAME + '/GetHardwareById',
    Save_Software_DETAILS : BASE_URL + CONTROLLER_NAME + '/SaveSoftwareDetails',
    Save_Hardware_DETAILS : BASE_URL + CONTROLLER_NAME + '/SaveHardwareDetails',
}