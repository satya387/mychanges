import { Component, OnInit } from '@angular/core';
import { settings } from 'src/app/common/configuration.settings';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-created-project',
  templateUrl: './created-project.component.html',
  styleUrls: ['./created-project.component.scss']
})
export class CreatedProjectComponent implements OnInit {

  projectList: any;
  selectedProjectId : number;
  showProjectError = false;
  createdProjects : any;
  requestBody : any;
  totalRecord: any;
  limit: any = 8;
  offset: any = settings.offset;
  page: any = 1;
  isPageChanged: any;

  constructor(private oppRlsExpService: OpportunityRlsExpenseService, private toastService: ToastService, private router: Router) { }

  ngOnInit(): void {
    this.getProjectList();
    this.configureRequest();
  }

  goBack() {
    this.router.navigate(['resource-loading']);
  }

  getProjectList() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    this.oppRlsExpService.getProjectList().subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  onSelectProject(event) {
    if (event != undefined) {
      this.selectedProjectId = event?.projectId || null;
      this.showProjectError = !this.selectedProjectId;

      if (this.selectedProjectId != null && this.selectedProjectId != undefined)
        this.configureRequest();
    }
  }

  onClearProject() {
    this.selectedProjectId = null;
    this.showProjectError = !this.selectedProjectId;
    this.configureRequest();
  }

  getProjectTitle(): string {
    if (!this.projectList || this.projectList.length === 0) {
      return 'Select Project';
    }

    if (!this.selectedProjectId) {
      return 'Select Project'; // no title when nothing is selected
    }

    const project = this.projectList.find(p => p.projectId === this.selectedProjectId);
    return project ? project.projectName : 'Select Project';
  }

  configureRequest() {  
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empEmidsId = userData.EmployeeId; //'INEMP019';
    
    this.requestBody = {
      "PageNumber": this.isPageChanged ? this.offset :  1,
      "PageSize": this.limit,
      "EmpEmidsId": empEmidsId,
      "ProjectId" : this.selectedProjectId ? this.selectedProjectId : 0
    }
    this.page = this.isPageChanged ? this.offset : 1;
    this.offset = this.isPageChanged ? this.offset : 1;
    this.GetAllCreatedProjects();
  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    this.isPageChanged = this.page === 1 ? false : true;
    this.configureRequest();
  }

  GetAllCreatedProjects() {
    this.oppRlsExpService.getAllCreatedProjects(this.requestBody).subscribe((response: any) => {
        this.createdProjects = response.data;
        this.totalRecord = response.totalCount;
        this.isPageChanged = false;
      }, 
      (error: any) => {
        console.log(error);
        this.toastService.showError(error, 'Error');
    });
  }

  openuploadDocumnet(data) {
    var fileName = data.opportunityId+'_'+data.versionName+'.xlsx';
    var folderName = data.opportunityId;
    
    const object = {
      FileName: fileName,
      FolderName: folderName
    }
    this.oppRlsExpService.getUploadFile(object).subscribe((response: any) => {
      const contentType = this.getContentTypeFromExtension(fileName);

      debugger;
      const blob = new Blob([response.body], { type: contentType });
      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.name = fileName;
      link.title = fileName;
      link.download = fileName;
      link.click();
      link.href = "";
      window.URL.revokeObjectURL(downloadURL);
    });
  }

  getContentTypeFromExtension(fileName: string): string {
    const fileExtension = this.getFileExtension(fileName);
  
    switch (fileExtension.toLowerCase()) {
      case 'pdf':
        return 'application/pdf';
      case 'doc':
        return 'application/msword';
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'xls':
        return 'application/vnd.ms-excel';
      case 'xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'txt':
        return 'text/plain';
      default:
        return null; // Default content type for unknown types
    }
  }

  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
}
