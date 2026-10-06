import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DocumentWindowService } from 'src/app/main-layout/documentService';
import { IronCladContractDetails } from 'src/app/main-layout/iron-clad-dashboard/iron-clad.model';
import { IronCladService } from 'src/app/main-layout/iron-clad-dashboard/iron-clad.service';
import { CustomerValueAddService } from 'src/app/customer-value-add/customer-value-add.service';
import * as bootstrap from 'bootstrap';
import moment from 'moment';
import { AlertModuleService } from 'src/app/alert-module/alert-module.service';

export interface Timeline {
  contractHistoryId: number;
  contractId: number;
  contractAdminStatusId: number;
  nextStage: number;
  comments: string;
  actionTakenBy: string;
  actionTakenDate: Date;
  stageName: string;
  status: string;
}
export interface IronCladAttachment {
  attachmentId: number;
  contractId: number;
  contractAttachment: string;
  createdDate: string;
}



@Component({
  selector: 'app-iron-clad-contract-details',
  templateUrl: './iron-clad-contract-details.component.html',
  styleUrls: ['./iron-clad-contract-details.component.scss']
})
export class IronCladContractDetailsComponent implements OnInit, OnDestroy {

  entityList: any[] = [];
  accountList: any[] = [];
  projectList: any[] = [];
  contract: any = null;
  loading = false;
  error = '';
  selectedFiles: File[] = [];
  safeUrl: SafeResourceUrl | null = null;
  openedFiles: Set<string> = new Set<string>();
  documentVersions: any[] = [];
  refreshInterval: any;
  contractId!: number;
  approvalStatus = 0;
  isSubmitting = false;
  timelineList: Timeline[] = [];
  approvedCount: number = 0;
  loadingTimeline = false;
  reviewCount = 0;
  Userlist: any[] = [];
  selectedDocumentType = '';
  documentList: any[] = [];
  contractName = '';
  timelineComment: string = '';
  isSendingComment: boolean = false;
  model: IronCladContractDetails = {
    isActive: true,
    entityId: null,
    accountId: null,
    projectId: null,
    approvalLevel: 0,

  };
  constructor(
    private route: ActivatedRoute,
    private ironCladService: IronCladService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private documentWindowService: DocumentWindowService,
    private toastService: ToastService,
    private customerValueAddSevice: CustomerValueAddService,
    private alertService: AlertModuleService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contractId = +id;
      this.getById(this.contractId);
      this.refreshInterval = setInterval(() => {
        this.refreshContractWithoutLoader(this.contractId);
      }, 20000);
    }
    this.GetApproverList();
  }

  resetApproverForm(): void {
  this.approver = {
    assignedTo: '',
    instructions: ''
  };
}

  getDocumentTypes() {
    this.ironCladService.getDocumentTypes(1)
      .subscribe((res: any[]) => {
        this.documentList = res.map(d => ({
          id: d.id || d.ID,
          name: d.name || d.Name
        }));

      });
  }


  
  
  ngOnDestroy(): void {

    if (this.refreshInterval) {

      clearInterval(this.refreshInterval);

    }
  }


  viewDocument(
    contractId: number,
    fileName: string
  ) {
    this.ironCladService
      .viewDocument(contractId, fileName)
      .subscribe({
        next: (res: any) => {
          if (res?.success && res?.url) {
            window.open(res.url, '_blank');
          }
        }
      });
  }

  viewPdf(
    contractId: number,
    fileName: string
  ): void {

    const token = sessionStorage.getItem('customToken');

    const url =
      this.ironCladService.viewPdf(contractId, fileName) +
      `&token=${encodeURIComponent(token || '')}`;

    window.open(url, '_blank');
  }

 

  getById(id: number): void {
    this.loading = true;

    this.ironCladService.getById(id).subscribe({
      next: (res: any) => {

        this.contract = {
          ...res,

          contractName:
            res.contractName ||
            res.ContractName ||
            '',

          selectedDocumentType:
            res.documentName ||
            res.DocumentName ||
            '',

          entityName:
            res.entityName ||
            res.EntityName ||
            '',

          accountName:
            res.accountName ||
            res.AccountName ||
            '',

          projectName:
            res.projectName ||
            res.ProjectName ||
            '',

          canadaMargin: res.canadamargin,
          canadaRevenue: res.canadarevenue,

          mexicoMargin: res.mexicomargin,
          mexicoRevenue: res.mexicorevenue,

          argentinaMargin: res.argentinamargin,
          argentinaRevenue: res.argentinarevenue,

          eastEuropeMargin: res['east_Europemargin'],
          eastEuropeRevenue: res['east_Europerevenue'],

          indiaMargin: res.offshoremargin,
          indiaRevenue: res.offshorerevenue
        };

        this.loading = false;
        this.GetTimeLineList(id);
        this.getContractFiles(id);
      },

      error: () => {
        this.error = 'Failed to load details';
        this.loading = false;
      }
    });
  }

  extractDateFromFileName(fileName: string): Date | null {
    try {
      const matches = [
        ...fileName.matchAll(/_(\d{8})_(\d{6})/g)
      ];
      if (!matches.length) {
        return null;
      }
      const match = matches[matches.length - 1];
      const datePart = match[1];
      const timePart = match[2];
      const month = parseInt(datePart.substring(0, 2), 10);
      const day = parseInt(datePart.substring(2, 4), 10);
      const year = parseInt(datePart.substring(4, 8), 10);
      const hours = parseInt(timePart.substring(0, 2), 10);
      const minutes = parseInt(timePart.substring(2, 4), 10);
      const seconds = parseInt(timePart.substring(4, 6), 10);

      return new Date(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
      );

    } catch {
      return null;
    }
  }

  getDisplayDate(file: any) {
    const fileDate = file.date;

    if (!fileDate) {
      return {
        label: 'Uploaded',
        value: 'Just now'
      };
    }

    return {
      label: 'Uploaded',
      value: moment(fileDate).fromNow()
      // value: `(${moment(fileDate).fromNow()})`
    };
  }

  EditContractPage(data: IronCladContractDetails): void {

    // const contractId = data.contractId 
    this.router.navigate(
      ['/Customer-Contract-Review/add-contract-management-documents'],
      {
        queryParams: {
          contractId: data.contractId

        }
      }
    );
  }

  onFileSelected(event: any): void {

    const files: File[] = Array.from(event.target.files);

    if (!files.length) {
      return;
    }

    const invalidFiles = files.filter(file => {
      const extension = file.name
        .split('.')
        .pop()
        ?.toLowerCase();

      return extension !== 'doc' && extension !== 'docx';
    });

    if (invalidFiles.length > 0) {

      this.toastService.showError(
        'Only .doc and .docx files are allowed.',
        'Validation Error'
      );

      this.selectedFiles = [];
      event.target.value = '';

      return;
    }

    this.selectedFiles = files;

    if (this.selectedFiles.length > 0) {
      this.uploadFiles();
    }
  }

  uploadFiles() {
    if (!this.selectedFiles.length) {
      return;
    }
    const contractId = this.contract?.contractId;
    if (!contractId) {
      this.toastService.showError(
        'Invalid contract ID',
        'Error'
      );
      return;
    }

    this.ironCladService
      .uploadDocument(
        this.selectedFiles,
        contractId
      )
      .subscribe({
        next: (res: any) => {
          this.toastService.showSuccess(
            'File uploaded successfully',
            'Success'
          );
          this.selectedFiles = [];
        },

        error: (err) => {
          this.toastService.showError(
            err?.error?.message || 'Upload failed',
            'Error'
          );
        }
      });
    this.UploadLog();
  }
  openDocument(contractId: number, fileName: string) {
    const baseFilename = fileName.replace(/_\d{8}_\d{6}(?=\.[^.]+$)/, '');
    console.log('Filename', fileName)
    console.log('baseFilename', baseFilename)
    if (this.documentWindowService.isOpen(baseFilename)) {
      this.toastService.showInfo(
        'This document is already open. Please refer to the opened file for edit.',
        'Information'
      );
      return;
    }

    this.ironCladService.openDocument(contractId, fileName)
      .subscribe({
        next: (res: any) => {

          if (res?.success && res?.url) {

            this.documentWindowService.open(
              baseFilename,
              res.url
            );

          } else {

            this.toastService.showError(
              res?.message || 'Unable to open document.',
              'Error'
            );

          }
        },
        error: () => {
          this.toastService.showError(
            'Unable to open document.',
            'Error'
          );
        }
      });
  }

  approver = {
    assignedTo: '',
    instructions: ''
  };
  openApprovalModal(status: number) {
    this.approvalStatus = status;
    this.approver.instructions = '';
    const modal = new bootstrap.Modal(
      document.getElementById('approvalModal')!
    );

  modal.show();
}
saveApprover() {
  if (!this.approver.assignedTo) {
     this.toastService.showError('Please select an approver.', 'Error');
    return;
  }
  const payload = {
    empEmidsID: this.approver.assignedTo,
    instructions: this.approver.instructions,
    contractId: this.contract.contractId,
    status:1
  };
  this.ironCladService.SaveApprover(payload).subscribe({
    next: (res: any) => {
      this.approver = {
        assignedTo: '',
        instructions: ''
      };

      this.getById(this.contract.contractId);
       if (res > 0) {
        this.getById(this.contract.contractId);
        this.toastService.showSuccess('Successfully submitted.', 'Success');
      } else {
        this.toastService.showError('Error while submitting.', 'Error');
      }
    },
    error: (err) => {
     this.toastService.showError('Something went wrong', 'Error');

      }
    });
  }

  GetApproverList() {
    this.ironCladService.GetContractReviwer().subscribe((response: any) => {
      this.Userlist = response;
    });
  }

  submitApproval(event?: MouseEvent) {
    console.count('submitApproval called');
    event?.preventDefault();
    event?.stopPropagation();
    const payload = {
      empEmidsID: null,
      contractId: this.contract.contractId,
      status: this.approvalStatus,
      currentStatus: this.contract.contractAdminStatusId,
      instructions: this.approver.instructions,
      currenctApprovalLevel: this.contract.approvalLevel
    };

    this.ironCladService.SubmmitApproval(payload).subscribe({
      next: (res) => {

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('approvalModal')!
      );
      modal?.hide();
      this.getById(this.contract.contractId);
      this.approver.instructions = '';
       
        if (res > 0 ) {
        this.getById(this.contract.contractId);
        this.toastService.showSuccess('Successfully submitted.', 'Success');
        }
      else{
        this.toastService.showError('Error while submitting.', 'Error');
      }
    },
      error: (err) => {
        this.toastService.showError('Something went wrong', 'Error');
    }
  });
}

  GetTimeLineList(id: number) {
    this.loadingTimeline = true;
    this.ironCladService.GetTimeLineList(id)
      .subscribe({
        next: (res: any) => {
          this.timelineList = res;
          this.approvedCount = this.timelineList
            .filter((x: any) => x.status === 'Approved').length;
          this.reviewCount = this.timelineList
            .filter((x: any) => x.status !== 'Waiting').length;
          this.loadingTimeline = false;
        },
        error: () => {
          this.loadingTimeline = false;
        }
      });

  }
  getInitials(name: string) {
    if (!name)
      return '?';

    return name
      .split(' ')
      .map(x => x.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  avatarColors = [
    '#6264A7', // Purple
    '#107C10', // Green
    '#0078D4', // Blue
    '#D83B01', // Orange
    '#C239B3', // Pink
    '#498205', // Olive
    '#8764B8', // Violet
    '#038387', // Teal
    '#CA5010', // Brown
    '#E81123'  // Red
  ];

  getAvatarColor(name: string): string {

    if (!name) {
      return '#00080e';
    }

    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return this.avatarColors[Math.abs(hash) % this.avatarColors.length];
  }
  downloadLatestDocument() {
    if (!this.documentVersions.length) {
      return;
    }
    this.DownloadDocumentLogs()
    const latestFile = this.documentVersions[0].fileName;

    this.viewPdf(this.contract.contractId, latestFile);

  }
  openConfirmPopup() {

    const approverModalEl =
      document.getElementById('approverModal');

    const approverModal =
      bootstrap.Modal.getInstance(approverModalEl!);

    approverModal?.hide();

    setTimeout(() => {

      document
        .querySelectorAll('.modal-backdrop')
        .forEach(x => x.remove());

      document.body.classList.remove('modal-open');

      const confirmModalEl =
        document.getElementById('confirmApproverModal');

      const confirmModal =
        new bootstrap.Modal(confirmModalEl!);

      confirmModal.show();

    }, 500);
  }
  confirmSaveApprover() {
    const confirmModal = bootstrap.Modal.getInstance(
      document.getElementById('confirmApproverModal')!
    );

    confirmModal?.hide();

    this.saveApprover();
  }
  closeConfirmModal() {

    const confirmModal =
      bootstrap.Modal.getInstance(
        document.getElementById('confirmApproverModal')!
      );

    confirmModal?.hide();

    setTimeout(() => {

      document
        .querySelectorAll('.modal-backdrop')
        .forEach(x => x.remove());

      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('padding-right');

    }, 300);
  }
  refreshContractWithoutLoader(contractId: number): void {
    this.ironCladService.getFilesByContractIdwithoutloader(contractId)
      .subscribe({
        next: (files: IronCladAttachment[]) => {

          if (!files || !files.length) {
            this.documentVersions = [];
            return;
          }

          const sortedFiles = [...files].sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          );

          this.documentVersions = sortedFiles.map(
            (file, index) => ({
              attachmentId: file.attachmentId,
              contractId: file.contractId,
              fileName: file.contractAttachment,
              version: `v${sortedFiles.length - index}.0`,
              date: file.createdDate
            })
          );
        },

        error: () => {
          this.documentVersions = [];
        }
      });
  }
  getContractFiles(contractId: number): void {
    this.ironCladService.getFilesByContractId(contractId)
      .subscribe({
        next: (files: IronCladAttachment[]) => {

          if (!files || !files.length) {
            this.documentVersions = [];
            return;
          }

          const sortedFiles = [...files].sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime()
          );

          this.documentVersions = sortedFiles.map(
            (file, index) => ({
              attachmentId: file.attachmentId,
              contractId: file.contractId,
              fileName: file.contractAttachment,
              version: `v${sortedFiles.length - index}.0`,
              date: file.createdDate
            })
          );
        },

        error: () => {
          this.documentVersions = [];
        }
      });
  }
  DownloadDocumentLogs() {
    const payload = {
      empEmidsID: null,
      contractId: this.contract.contractId,
      status: 0,
      currentStatus: 0,
      instructions: null,
      currenctApprovalLevel: 0
    };

    this.ironCladService.SubmmitApproval(payload).subscribe({
      next: (res) => {
        this.GetTimeLineList(this.contract.contractId);
      }

    });
  }
  UploadLog() {
    const payload = {
      empEmidsID: null,
      contractId: this.contract.contractId,
      status: 4,
      currentStatus: 0,
      instructions: null,
      currenctApprovalLevel: 0
    };

    this.ironCladService.SubmmitApproval(payload).subscribe({
      next: (res) => {
        this.GetTimeLineList(this.contract.contractId);
      }

    });
  }
  sendTimelineComment(): void {

    if (!this.timelineComment?.trim()) {
      return;
    }

    this.isSendingComment = true;

    const comment = this.timelineComment.trim();

    const payload = {
      empEmidsID: null,
      contractId: this.contract.contractId,
      status: 5,
      currentStatus: this.contract.isAdmin ? 1 : 0,
      instructions: comment,
      currenctApprovalLevel: this.contract.approvalLevel
    };

    this.ironCladService.SubmmitApproval(payload).subscribe({
      next: (res) => {

        const modal = bootstrap.Modal.getInstance(
          document.getElementById('approvalModal')!
        );
        this.GetTimeLineList(this.contract.contractId);
        this.approver.instructions = '';
        if (res > 0) {
          this.toastService.showSuccess('Successfully submitted.', 'Success');
          this.timelineComment = '';
          this.isSendingComment = false;
        }
        else {
          this.toastService.showError(res, 'Error');
          this.timelineComment = '';
          this.isSendingComment = false;
        }
        this.GetTimeLineList(this.contract.contractId);
      },
      error: (err) => {
        this.GetTimeLineList(this.contract.contractId);
        this.timelineComment = '';
        this.isSendingComment = false;
        // this.toastService.showError('Something went wrong', 'Error');
      }

    });

  }
  getTimelineDisplayDate(item: Timeline) {
  if (!item.actionTakenDate) {
    return {
      label: 'Action Taken',
      value: 'Just now'
    };
  }

  return {
    label: 'Action Taken',
    value: moment(item.actionTakenDate).fromNow()
  };
}
getSelectedApproverName(): string {
  if (!this.approver.assignedTo) {
    return '';
  }
  
  const selectedUser = this.Userlist.find(u => u.empEmidsID === this.approver.assignedTo);
  
  return selectedUser ? selectedUser.commonName : 'this user';
}
}
