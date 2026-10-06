import { Component, OnInit } from '@angular/core';
import { IronCladContractDetails } from '../../main-layout/iron-clad-dashboard/iron-clad.model';
import { IronCladService } from '../../main-layout/iron-clad-dashboard/iron-clad.service';
import { AlertModuleService } from 'src/app/alert-module/alert-module.service';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { OpportunityRlsExpenseService } from 'src/app/opportunity-rls-expense/opportunity-rls-expense.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-add-contract-management-documents',
  templateUrl: './add-contract-management-documents.component.html',
  styleUrls: ['./add-contract-management-documents.component.scss']
})
export class AddContractManagementDocumentsComponent implements OnInit {

  selectedDocumentType: string = '';
  entityList: any[] = [];
  model: IronCladContractDetails = {
    isActive: true,
    entityId: null,
    accountId: null,
    projectId: null,
    isEmidsTemplate: false,
  };
  buList = [
    'Payer Enterprise',
    'Provider Enterprise',
    'Health Technology',
    'Others'
  ];
  accountList: any[] = [];
  projectList: any[] = [];
  saving = false;
  error = '';
  errors: any = {};
  isEditMode = false;
  documentSourceChanged = false;
  documentList: any[] = [];
  fileValidationMessage: string = '';
  recordVersionBase64?: string;
  RecordVersion: any = 0;
  salesforceFiles: any[] = [];
  templateValidationMessage: string = '';
  empMailId: any;
  @Input() data: IronCladContractDetails | null = null;
  isAdmin: boolean = true;


  constructor(private ironService: IronCladService,
    private alertService: AlertModuleService,
    private router: Router,
    private route: ActivatedRoute,
    private oppRlsExpService: OpportunityRlsExpenseService,
    private toastr: ToastrService) { }


  ngOnInit(): void {

    this.getEntityList();
    this.getAccountList();
    this.getDocumentTypes();
    this.empMailId = JSON.parse(
      sessionStorage.getItem('userDetail')
    ).EmpFullEmailId;
    this.route.queryParams.subscribe(params => {
      const contractId = Number(params['contractId']);

      if (contractId && contractId > 0) {

        this.isEditMode = true;

        this.ironService.getById(contractId).subscribe({

          next: (data: any) => {

            this.model = {
              ...data,

              contractId: data.contractId || data.ContractId,
              displayId: data.displayId || data.DisplayId || '',
              contractName:
                data.contractName ||
                data.ContractName ||
                '',

              salesforceId:
                data.salesforceId ||
                data.SalesForceId ||
                data.salesForceId ||
                '',

              BU:
                data.BU ||
                data.bu ||
                '',

               isEmidsTemplate:
      data.isEmidsTemplate === true ||
      data.isEmidsTemplate === 1 ||
      data.isEmidsTemplate === 'true' ||
      data.isEmidsTemplate === '1',

              dateOfAggrement: this.formatDate(
                data.dateOfAggrement || data.DateOfAggrement
              ),

              startDate: this.formatDate(
                data.startDate || data.StartDate
              ),

              endDate: this.formatDate(
                data.endDate || data.EndDate
              ),

              // CHANGE ORDER

              amendmentNumber:
                data.amendmentNumber ??
                data.AmendmentNumber,

              changeDescription:
                data.changeDescription ??
                data.ChangeDescription,

              poNumber:
                data.poNumber,

              poAmount:
                data.poAmount,

              fileList:
                data.fileList ||
                data.FileList ||
                [],

              documentId:
                data.documentId ||
                data.DocumentId,

              entityId:
                data.entityId ||
                data.EntityId,

              accountId:
                data.accountId ||
                data.AccountId,

              projectId:
                data.projectId ||
                data.ProjectId,

              groupMailId:
                data.groupMailId ||
                data.GroupMailId,

              creditPeriod:
                data.creditPeriod ?? data.CreditPeriod,

              terminationPeriod:
                data.terminationPeriod ?? data.TerminationPeriod,

              rateIncrease:
                data.rateIncrease ?? data.RateIncrease,

              indemnity:
                data.indemnity ?? data.Indemnity,

              limitationOfLiability:
                data.limitationOfLiability ??
                data.LimitationOfLiability,

              nonsolicitation:
                data.nonsolicitation ??
                data.Nonsolicitation,

              assignment:
                data.assignment ??
                data.Assignment,

              comments:
                data.comments ??
                data.Comments,

              totalContractValue:
                data.totalContractValue ??
                data.TotalContractValue,

              blendedMargin:
                data.blendedMargin ??
                data.BlendedMargin,

              // NEW US FIELDS

              usRevenue:
                data.usRevenue ??
                data.UsRevenue,

              usMargin:
                data.usMargin ??
                data.UsMargin,

              // CANADA

              canadaRevenue:
                data.canadarevenue ??
                data.Canadarevenue,

              canadaMargin:
                data.canadamargin ??
                data.Canadamargin,

              // MEXICO

              mexicoRevenue:
                data.mexicorevenue ??
                data.Mexicorevenue,

              mexicoMargin:
                data.mexicomargin ??
                data.Mexicomargin,

              // ARGENTINA

              argentinaRevenue:
                data.argentinarevenue ??
                data.Argentinarevenue,

              argentinaMargin:
                data.argentinamargin ??
                data.Argentinamargin,

              // EAST EUROPE

              eastEuropeRevenue:
                data.east_Europerevenue ??
                data.East_Europerevenue,

              eastEuropeMargin:
                data.east_Europemargin ??
                data.East_Europemargin,

              // INDIA

              indiaRevenue:
                data.offshorerevenue ??
                data.Offshorerevenue,

              indiaMargin:
                data.offshoremargin ??
                data.Offshoremargin,

              // SOW

              billingType:
                data.billingType ??
                data.BillingType,

              resourceCount:
                data.resourceCount ??
                data.ResourceCount,

              // CHANGE ORDER




            };
            if (contractId) {
              this.loadFiles(contractId);
            }

            this.RecordVersion = data.recordVersion || data.RecordVersion;
            const recordVer = data.recordVersion || data.RecordVersion;

            if (recordVer) {
              if (typeof recordVer === 'string') {
                this.recordVersionBase64 = recordVer;
              } else if (Array.isArray(recordVer)) {
                const bytes = new Uint8Array(recordVer);
                let binary = '';

                bytes.forEach(b => binary += String.fromCharCode(b));

                this.recordVersionBase64 = btoa(binary);
              }
            }
            this.onDocumentChange();

            if (this.model.accountId) {
              this.getProjectList(this.model.accountId);
            }
          },

          error: (err) => {
            console.error('Get By Id Error:', err);
          }
        });
      }
    });
  }
  getSalesforceList() {
    this.oppRlsExpService
      .getAllOpportunity(this.empMailId, this.isAdmin)
      .subscribe({
        next: (res: any) => {
          this.salesforceFiles = res;
          if (this.model.salesforceId) {
            this.model.salesforceId = String(this.model.salesforceId);
          }
        }
      });
  }
  formatDate(date: any): string | null {
    if (!date) {
      return null;
    }

    return moment(date).format('YYYY-MM-DD');
  }
  preventDateTyping(event: KeyboardEvent) {
    event.preventDefault();
  }
  onDocumentChange(): void {

    const selected = this.documentList.find(
      x => Number(x.id) === Number(this.model.documentId)
    );

    this.selectedDocumentType = selected?.name || '';
     this.model.isEmidsTemplate = selected?.isTemplate === 1;
     this.templateValidationMessage = ''
    if (
      this.selectedDocumentType === 'Statement of Work' ||
      this.selectedDocumentType === 'Change Order/Amendment'
    ) {
      this.getSalesforceList();
    }
  }

  getSelectedProjectName(): string {
    return this.projectList.find(
      x => x.projectId === this.model.projectId
    )?.projectName || '';
  }
  getDocumentTypes(): void {
    this.ironService.getDocumentTypes(1)
      .subscribe({
        next: (res: any[]) => {

          this.documentList = res.map(d => ({
            id: d.id || d.ID,
            name: d.name || d.Name,
            isTemplate: d.isTemplate ?? d.IsTemplate ?? 0
          }));

          // Fix for edit mode issue
          if (this.isEditMode && this.model.documentId) {
            this.onDocumentChange();
          }
        },
        error: (err) => {
          console.error('Document Types API Error:', err);
        }
      });
  }
  getAccountList(): void {
    this.ironService.GetAccountListbyEmpId().subscribe({
      next: (response: any) => {
        this.accountList = response;
      },
      error: (error) => {
        console.error(error);
      }

    });

  }

  loadFiles(contractId: number): void {

    this.ironService.getFiles(contractId)
      .subscribe({

        next: (res: any) => {
          this.model.fileList = (res || []).map(
            (x: any) => x.contractAttachment
          );
        },

        error: (err) => {
          console.error(err);
        }

      });
  }
  onAccountChange(): void {
    this.model.projectId = null;
    if (this.model.accountId) {
      this.getProjectList(this.model.accountId);
    } else {
      this.projectList = [];
    }
  }

  getProjectList(accountId: number): void {
    this.ironService.GetProjectbyEmpId(accountId).subscribe({
      next: (response: any) => {
        this.projectList = response;
      },

      error: (error) => {
        console.error(error);
      }

    });

  }

 submit(): void {

  this.errors = {};
  let isValid = true;

  if (this.model.isEmidsTemplate === true) {

    const selected = this.documentList.find(
      x => Number(x.id) === Number(this.model.documentId)
    );

    if (Number(selected?.isTemplate) !== 1) {

      this.templateValidationMessage =
        'Emids Template is not available for the selected document type. Please upload a file.';

      this.saving = false;
      return;
    }
  }
  // Entity validation
  if (!this.model.entityId) {
    this.errors.entity = true;
    isValid = false;
  }

  // Document Type validation
  if (!this.model.documentId) {
    this.errors.document = true;
    isValid = false;
  }

  // Start Date validation
  if (!this.model.startDate) {
    this.errors.startDate = true;
    isValid = false;
  }

  // End Date validation
  if (!this.model.endDate) {
    this.errors.endDate = true;
    isValid = false;
  }

  // Agreement Date should not be after Start Date
  if (
    this.model.dateOfAggrement &&
    this.model.startDate &&
    new Date(this.model.dateOfAggrement) > new Date(this.model.startDate)
  ) {
    this.errors.agreementDateAfterStart = true;
    isValid = false;
  } else {
    this.errors.agreementDateAfterStart = false;
  }

  // End Date should not be before Start Date
  if (
    this.model.startDate &&
    this.model.endDate &&
    new Date(this.model.endDate) < new Date(this.model.startDate)
  ) {
    this.errors.endDateBeforeStart = true;
    isValid = false;
  } else {
    this.errors.endDateBeforeStart = false;
  }

  // Start Date should not be before Agreement Date
  if (
    this.model.dateOfAggrement &&
    this.model.startDate &&
    new Date(this.model.startDate) < new Date(this.model.dateOfAggrement)
  ) {
    this.errors.startDateBeforeAgreement = true;
    isValid = false;
  } else {
    this.errors.startDateBeforeAgreement = false;
  }

  // =====================================================
  // FILE VALIDATION
  // =====================================================

  // ADD MODE + MSA
  if (
    !this.isEditMode &&
    this.selectedDocumentType === 'Master Services Agreement' &&
    !this.model.file
  ) {
    this.errors.file = true;
    isValid = false;
  }

  // ADD MODE + Upload Document
  else if (
    !this.isEditMode &&
    this.selectedDocumentType !== 'Master Services Agreement' &&
    this.model.isEmidsTemplate === false &&
    !this.model.file
  ) {
    this.errors.file = true;
    isValid = false;
  }

  // EDIT MODE
  else if (
    this.isEditMode &&
    this.selectedDocumentType !== 'Master Services Agreement'
  ) {
    if (
      this.documentSourceChanged &&
      this.model.isEmidsTemplate === false &&
      !this.model.file
    ) {
      this.errors.file = true;
      isValid = false;
    }
  }

  if (this.fileValidationMessage) {
    this.errors.file = true;
    isValid = false;
  }
  // Stop if validation fails
  if (!isValid) {
    return;
  }

  this.saving = true;

  const formData = new FormData();

  const selectedEntity = this.entityList.find(
    x => x.id === this.model.entityId
  );

  const selectedAccount = this.accountList.find(
    x => x.accountId === this.model.accountId
  );

  const selectedProject = this.projectList.find(
    x => x.projectId === this.model.projectId
  );

  const payload = {

    ...this.model,

    entityName: selectedEntity?.name || '',
    accountName: selectedAccount?.accountName || '',
    projectName: selectedProject?.projectName || '',

    East_Europerevenue: this.model.eastEuropeRevenue,
    East_Europemargin: this.model.eastEuropeMargin,

    Offshorerevenue: this.model.indiaRevenue,
    Offshoremargin: this.model.indiaMargin,

    AmendmentNumber: this.model.amendmentNumber,
    ChangeDescription: this.model.changeDescription,

    isEmidsTemplate: this.model.isEmidsTemplate,

    dateOfAggrement: this.model.dateOfAggrement
      ? moment(this.model.dateOfAggrement).format('YYYY-MM-DD')
      : null,

    startDate: this.model.startDate
      ? moment(this.model.startDate).format('YYYY-MM-DD')
      : null,

    endDate: this.model.endDate
      ? moment(this.model.endDate).format('YYYY-MM-DD')
      : null,

    recordVersion: this.recordVersionBase64
  };

  formData.append(
    'ironCald',
    JSON.stringify(payload)
  );

  if (this.model.file) {
    formData.append(
      'files',
      this.model.file
    );
  }

  const apiCall = this.isEditMode
    ? this.ironService.update(formData)
    : this.ironService.add(formData);

  apiCall.subscribe({

    next: (res: any) => {

      if (
        res.message ===
        'Record modified. Reload to view latest data.'
      ) {

        this.error =
          'Record modified. Reload to view latest data.';

        this.saving = false;
        return;
      }
     if(res > 0)
     {
      this.toastr.success(
        this.isEditMode
          ? 'Contract updated successfully'
          : 'Contract saved successfully',
        'Success'
      );
     }
      else if(res = -1)
      {
       this.toastr.success(
        this.isEditMode
          ? 'Contract updated successfully but document upload failed'
          : 'Contract saved successfully but document upload failed',
        'Success'
      );

      }
      else{
         this.toastr.error('Save failed', 'Error');
      }

      this.afterSave(res);

      this.saving = false;
    },

error: (err: any) => {

  if (err?.status === 400 && this.model.isEmidsTemplate) {

    this.toastr.warning(
      'Emids template is not present. Please contact administrator or upload a file.',
      'Validation'
    );

    this.saving = false;
    return;
  }

  this.toastr.error('Save failed', 'Error');

  this.saving = false;
}
  });
}
onDocumentSourceChange(): void {
  this.documentSourceChanged = true;
  this.errors.file = false;
  this.fileValidationMessage = '';
  this.templateValidationMessage = '';

  if (this.model.isEmidsTemplate === true) {

    // Hide uploaded file when Emids Template is selected
    this.model.file = null;

    const selected = this.documentList.find(
      x => Number(x.id) === Number(this.model.documentId)
    );

    if (Number(selected?.isTemplate) !== 1) {
      this.templateValidationMessage =
        'Emids Template is not available for the selected document type. Please upload a file.';
    }
  }
}

  disableScroll(event: WheelEvent): void {
    (event.target as HTMLInputElement).blur();
  }

  preventDecimal(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  getEntityList(): void {
    this.ironService.getEntityList().subscribe({
      next: (response) => {
        this.entityList = response;
      },

      error: (error) => {
        console.error('Entity API Error:', error);
      }

    });
  }

  goBack() {
    this.router.navigate(['/Customer-Contract-Review/dashboard']);
  }

  validateField(field: string): void {
    switch (field) {

      case 'document':
        this.errors.document = !this.model.documentId;
        break;

      case 'entity':
        this.errors.entity = !this.model.entityId;
        break;

      case 'account':
        this.errors.account = false;
        break;

      case 'project':
        this.errors.project = false;
        break;

      case 'endDate':
        this.errors.endDate = !this.model.endDate;

        this.errors.endDateBeforeStart =
          this.model.startDate &&
          this.model.endDate &&
          new Date(this.model.endDate) < new Date(this.model.startDate);
        break;

      case 'startDate':
        this.errors.startDate = !this.model.startDate;

        this.errors.startDateBeforeAgreement =
          this.model.dateOfAggrement &&
          this.model.startDate &&
          new Date(this.model.startDate) < new Date(this.model.dateOfAggrement);

        this.errors.endDateBeforeStart =
          this.model.startDate &&
          this.model.endDate &&
          new Date(this.model.endDate) < new Date(this.model.startDate);

        break;
      case 'agreementDate':
        this.errors.agreementDate = !this.model.dateOfAggrement;

        this.errors.startDateBeforeAgreement =
          this.model.dateOfAggrement &&
          this.model.startDate &&
          new Date(this.model.startDate) < new Date(this.model.dateOfAggrement);

        break;

      case 'file':

        if (
          this.selectedDocumentType !== 'Master Services Agreement' &&
          this.model.isEmidsTemplate === false
        ) {
          this.errors.file = !this.model.file;
        } else {
          this.errors.file = false;
        }

        break;
    }
  }

  afterSave(res: any) {


    window.dispatchEvent(
      new CustomEvent('ironclad:added', { detail: res })
    );

    this.saving = false;

    if (this.isEditMode) {

      const contractId =
        res?.contractId ||
        res?.ContractId ||
        res?.data?.contractId ||
        res?.data?.ContractId ||
        this.model.contractId ||
        this.model.ContractId;
      this.router.navigate([
        '/Customer-Contract-Review/Contract-Details',
        contractId
      ]);

      return;
    }

    this.router.navigate([
      '/Customer-Contract-Review/dashboard'
    ]);
  }

  onFileSelected(event: any): void {

    this.fileValidationMessage = '';
    this.errors.file = false;

    const file = event.target.files[0];

    if (!file) {
      this.validateField('file');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !['doc', 'docx'].includes(extension)) {

      this.fileValidationMessage =
        'Invalid file type. Please upload only .doc or .docx files.';

      this.errors.file = true;
      this.model.file = null;
      event.target.value = '';

      return;
    }

    this.model.file = file;
    this.errors.file = false;
  }
}
