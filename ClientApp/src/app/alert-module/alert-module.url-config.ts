import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const Alert_URLS = {
  GET_alert_details: BASE_URL + 'EscalationAlert/escalation-alert-details',
  Get_AlertDetailsbyId: BASE_URL + 'EscalationAlert/escalation-alert-details-byid?alertManagementId=',
  Get_AccountListbyId: BASE_URL + 'EscalationAlert/escalation-accounts-byempid',
 Get_ProjectListbyId: BASE_URL + 'EscalationAlert/escalation-projects-byempid',
 Get_EscalationCategory: BASE_URL + 'EscalationAlert/escalation-alert-category?IsFilterData=',
 Get_EscalationType: BASE_URL + 'EscalationAlert/escalation-alert-type?IsFilterData=',
 Get_PersonsListbyProjId: BASE_URL + 'EscalationAlert/escalation-responsibleperson-byprojid?projectId=',
 Submit_AlertDetails: BASE_URL + 'EscalationAlert/submit-escalation-alert',
 Update_AlertDetails: BASE_URL + 'EscalationAlert/update-escalation-alert',
 Download_Doc: BASE_URL + 'EscalationAlert/Download_Doc',
 DeleteById: BASE_URL + 'EscalationAlert/delete-escalation-alert',
 DeleteAttachments: BASE_URL + 'EscalationAlert/delete-escalationattachment-alert',
 GetAccountProjectFilterdData: BASE_URL + 'EscalationAlert/get-accountprojectfilter-alert',
 Submitcomments: BASE_URL + 'EscalationAlert/submit-escalationcomments-alert',
 Get_TimeLineListbyId: BASE_URL + 'EscalationAlert/escalation-timeline-byid?EscalationManagementId=',
 Get_EscalationPriority: BASE_URL + 'EscalationAlert/escalation-alert-priority?IsFilterData=',
 DownloadALLDocuments: BASE_URL + 'EscalationAlert/DownloadAllAttachmentsZip',
 Get_EscalationStatus: BASE_URL + 'EscalationAlert/escalation-alert-status?IsFilterData=',
}
