import { Component, OnInit,  Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AlertModuleService } from '../alert-module.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css']
})
export class CreateAlertComponent implements OnInit {
  dataForm!: FormGroup;
  Action: string = 'Raise Alert';
  today: Date = new Date();
  selectedFile?: File;
  selectedFileName?: string;
  recordVersionBase64?: string;
  AccountList: Array<{AccountId: number|string, AccountName: string}> = [];
  ProjectList: Array<{ProjectId: number|string, ProjectName: string}> = [];
  EscalationCategoryList: Array<{EscalationCategoryId: number|string, EscalationCategory: string}> = [];
  EscalationTypeList: Array<{EscalationTypeId: number|string, EscalationType: string}> = [];
  isLoadingAccounts = false;
  accounId: any =-0;
  projectId: any =0;
  PriorityList: any[] = [];
  ResponsiblePersonList: any[] = [];
  StatusList: any[] = [];
  selectedFiles: File[] = [];
  RecordVersion: any = 0
  Id?: any;
  managmentid: any = 0
  alertManagementId: any;
  removedExistingFiles: string[] = []; 
  existingAttachments: Array<{ name: string, url?: string }> = [];
  currentEscalationId: number | null = null;
  @Output() onSelectFiles: EventEmitter<File[]> = new EventEmitter<File[]>();
  minEscalationDate!: Date;
  maxEscalationDate!: Date;
  showEscalationDateMessage: string = '';
  escalationDateErrorMessage: string = '';

  private isAddMode: boolean = false;
  private isEditMode: boolean = false;

  // #region NEW - tooltip variable (you asked to use this name)
  workingDaysTooltip: string = '';
  // #endregion

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private alertModuleService: AlertModuleService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private elRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.setEscalationDateLimit();
    this.formInitialization();
    this.GetAccountListbyEmpId();
    this.GetEscalationType();
    this.GetEscalationCategory();
    this.GetEscalationPriority();
    this.loadStaticLists();
    this.setupEscalationDateValidation();
    setTimeout(() => {
      try {
        this.dataForm.get('EscalationPriorityId')?.valueChanges.subscribe(() => {
          this.calculateTargetResolutionDate();
        });
        this.dataForm.get('DateLogged')?.valueChanges.subscribe(() => {
          this.calculateTargetResolutionDate();
        });
      } catch (e) {
        console.error('Failed to attach priority/date subscriptions', e);
      }
    }, 0);

    this.activatedRoute.queryParams.subscribe((params) => {
      const isAddParam = params['isAdd'];
      const isEditParam = params['isEdit'];
      const alertManagementId = params['id'];
      this.managmentid = params['id'];
      this.alertManagementId = alertManagementId
      this.isAddMode = isAddParam === 'true';
      this.isEditMode = (isEditParam !== undefined) ? Number(isEditParam) === 1 : false;
      if (this.isAddMode) {
        this.Action = 'Raise Alert';
        this.dataForm.get('Status')?.setValue('Open'); 
        this.dataForm.get('Status')?.disable();
        this.dataForm.get('TargetResolutionDate')?.disable();

      } else if (this.isEditMode) {
        this.Action = 'Edit Alert';
        this.dataForm.get('Status')?.enable();
        this.dataForm.get('TargetResolutionDate')?.disable();
        if (alertManagementId) {
          this.GetAlertDetailsbyId(alertManagementId);
        }
      } else {
        this.Action = 'Raise Alert';
        this.dataForm.get('Status')?.enable();
        this.dataForm.get('TargetResolutionDate')?.disable();
      }
    });
  }
  formInitialization(data?: any) {
    const toDateOrNull = (d: any): Date | null => {
      if (!d) return null;
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return null;
      return dt;
    };
    this.dataForm = this.formBuilder.group({
      EscalationManagementId: [data ? data.EscalationManagementId : null],
      ProjectId: [data ? data.ProjectId : null, [Validators.required]],
      AccountId: [data ? data.AccountId : null, [Validators.required]],
      ProjectName: [data ? data.ProjectName : null],
      AccountName: [data ? data.AccountName : null],
      Title: [data ? data.Title : null, [Validators.required, this.noWhitespaceValidator, Validators.maxLength(200)]],
      Description: [data ? data.Description : null, [Validators.required, this.noWhitespaceValidator, Validators.maxLength(5000)]],
      EscalationTypeId: [data ? data.EscalationTypeId : null, [Validators.required]],
      EscalationType: [data ? data.EscalationType : null],
      EscalationCategoryId: [data ? data.EscalationCategoryId : null, [Validators.required]],
      EscalationCategory: [data ? data.EscalationCategory : null],
      EscalationPriority: [data ? data.EscalationPriority : null],
      EscalationPriorityId: [data ? data.EscalationPriorityId : null, [Validators.required]],
      ResponsiblePersonId: [data ? (typeof data.ResponsiblePersonId === 'string' ? data.ResponsiblePersonId.trim() : data.ResponsiblePersonId) : null, [Validators.required]],
      ResponsiblePerson: [data ? data.ResponsiblePerson : null,],
      TargetResolutionDate: [data ? data.TargetResolutionDate : null],
      Status: [data ? (data.Status !== undefined ? data.Status.toString() : 'Open') : 'Open', [Validators.required]],
      files: [[]],
      EscalatedBy: [data ? data.EscalatedBy : null, [Validators.required, this.noWhitespaceValidator]],
      DesignationOfThePerson: [data ? data.DesignationOfThePerson : null, [Validators.required, this.noWhitespaceValidator]],
      EscalationDate: [data ? data.EscalationDate : this.today, [Validators.required]],
    });
    if (data && data.RecordVersion) {
      if (typeof data.RecordVersion === 'string') {
        this.recordVersionBase64 = data.RecordVersion;
      } else if (Array.isArray(data.RecordVersion)) {
        const bytes = new Uint8Array(data.RecordVersion);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        this.recordVersionBase64 = btoa(binary);
      }
    }
  }
  private noWhitespaceValidator(control: AbstractControl) {
    if (!control || control.value == null) return null;
    return (typeof control.value === 'string' && control.value.trim().length === 0)
      ? { whitespace: true }
      : null;
  }
  loadStaticLists() {

    // this.PriorityList = [
    //   { value: 'Low', label: 'Low' },
    //   { value: 'Medium', label: 'Medium' },
    //   { value: 'High', label: 'High' },
    //   { value: 'Critical', label: 'Critical' }
    // ];

    this.StatusList = [
      { value: 'Open', label: 'Open' },
      { value: 'In Progress', label: 'In Progress' },
      { value: 'Resolved', label: 'Resolved' },
      { value: 'Closed', label: 'Closed' }
    ];
    this.EscalationTypeList = []; 
    this.EscalationCategoryList = []; 
  }
  onResponsibleSelect(event: any) {
    // event may be the id or the object depending on ng-select config.
    // We normalized ResponsiblePersonList to objects with ResponsiblePersonId and ResponsiblePerson
    let name: string | null = null;
    let id: any = null;
  
    if (event == null) {
      id = null; name = null;
    } else if (typeof event === 'object') {
      id = event.ResponsiblePersonId ?? event.employeeId ?? event.id ?? null;
      name = event.ResponsiblePerson ?? event.EmployeeName ?? null;
    } else {
      // event is the bound value (id). find the object from list
      id = event;
      const found = this.ResponsiblePersonList.find((r: any) => (r.ResponsiblePersonId ?? r.employeeId) == event);
      name = found ? (found.ResponsiblePerson ?? found.employeeName ?? null) : null;
    }
  
    // Set both controls so both are valid if id exists
    this.dataForm.get('ResponsiblePersonId')?.setValue(id);
    this.dataForm.get('ResponsiblePerson')?.setValue(name);
    // mark touched so validation messages appear immediately
    this.dataForm.get('ResponsiblePerson')?.markAsTouched();
    this.dataForm.get('ResponsiblePersonId')?.markAsTouched();
  }
  GetAlertDetailsbyId(alertManagementId: any) {
    this.alertModuleService.GetAlertDetailsbyId(alertManagementId).subscribe(
      (res: any) => {
        const raw = res?.data ?? res;
        console.log('res',res)
        this.accounId = res.accountId
        this.projectId = res.projectId
        this.RecordVersion = res.RecordVersion
        if (this.accounId != 0){
          this.GetProjectListbyEmpId()
        }
        if (this.projectId != 0){
          console.log('Proj',this.projectId)
          this.GetPersonsListbyProjId();
        }

        const g = (obj: any, ...names: string[]) => {
          for (const n of names) {
            if (obj === null || obj === undefined) break;
            if (n in obj && obj[n] !== undefined) return obj[n];
          }
          return undefined;
        };
       
        const alert = raw;
        const normalized: any = {
          EscalationManagementId: g(alert, 'escalationManagementId', 'EscalationManagementId') ?? null,
          ProjectId: g(alert, 'projectId', 'ProjectId') ?? null,
          AccountId: g(alert, 'accountId', 'AccountId') ?? null,
          ProjectName: g(alert, 'projectName', 'ProjectName') ?? null,
          AccountName: g(alert, 'accountName', 'AccountName') ?? null,
          Title: g(alert, 'title', 'Title') ?? null,
          Description: g(alert, 'description', 'Description') ?? null,
          EscalationTypeId: g(alert, 'escalationTypeId', 'EscalationTypeId') ?? null,
          EscalationType: g(alert, 'escalationType', 'EscalationType') ?? null,
          EscalationCategoryId: g(alert, 'escalationCategoryId', 'EscalationCategoryId') ?? null,
          EscalationCategory: g(alert, 'escalationCategory', 'EscalationCategory') ?? null,
          EscalationPriority: g(alert, 'escalationPriority', 'EscalationPriority') ?? null,
          EscalationPriorityId: g(alert, 'escalationPriorityId', 'EscalationPriorityId') ?? null,
          ResponsiblePersonId: (g(alert, 'responsiblePersonId', 'ResponsiblePersonId') ?? '')?.toString().trim() || null,
          ResponsiblePerson: g(alert, 'responsiblePerson', 'ResponsiblePerson') ?? null,
          TargetResolutionDate: this.toDateOnly(
            g(alert, 'targetResolutionDate', 'TargetResolutionDate')
          ),
          Status: g(alert, 'status', 'Status') ?? this.dataForm.value.Status,
          EscalatedBy: g(alert, 'escalatedBy', 'EscalatedBy') ?? null,
          DesignationOfThePerson: g(alert, 'designationOfThePerson', 'DesignationOfThePerson') ?? null,
          EscalationDate: this.toDateOnly(
            g(alert, 'escalationDate', 'EscalationDate')
          ),
        };
        if (!this.dataForm) {
          this.formInitialization(normalized);
          return;
        }
        this.dataForm.patchValue(normalized);
        this.currentEscalationId = normalized.EscalationManagementId ?? null;
        try {
          if (this.isAddMode) {
            this.calculateTargetResolutionDate();
          }
        } catch (e) {
          console.error('Error calculating target date after patch', e);
        }
        // #endregion

        const fileNameCombined = g(alert, 'FileName', 'fileName', 'AttachmentFileName', 'attachmentFileName');
        this.existingAttachments = [];
        if (fileNameCombined) {
          const parts = ('' + fileNameCombined).split(':').map(p => p.trim()).filter(p => p.length > 0);
          this.existingAttachments = parts.map(name => ({ name }));
          this.selectedFileName = this.existingAttachments.map(a => a.name).join(', ');
        }
        const recordVer = g(alert, 'recordVersion', 'RecordVersion');
        if (recordVer) {
          if (typeof recordVer === 'string') {
            this.recordVersionBase64 = recordVer;
          } else if (Array.isArray(recordVer)) {
            const bytes = new Uint8Array(recordVer);
            let binary = '';
            bytes.forEach((b) => (binary += String.fromCharCode(b)));
            this.recordVersionBase64 = btoa(binary);
          }
        }
        if (this.isAddMode) {
          this.dataForm.get('Status')?.setValue('Open');
          this.dataForm.get('Status')?.disable();
        } else {
          this.dataForm.get('Status')?.enable();
        }
      },
      (err) => {
        console.error('Failed to fetch alert details', err);
      }
    );
  }
  
  onSelect(event: any): void {
    let accountId: number | null = null;  
    if (event === null || event === undefined) {
      accountId = null;
    } else if (typeof event === 'number' || typeof event === 'string') {
      accountId = Number(event);
    } else if (Array.isArray(event)) {
      const first = event[0];
      accountId = first == null ? null
        : (typeof first === 'object' ? Number(first.AccountId ?? first.accountId ?? first) : Number(first));
    } else if (typeof event === 'object') {
      accountId = Number(event.AccountId ?? event.accountId ?? event.Id ?? event.value ?? NaN);
    } else {
      accountId = Number(event);
    }
    if (isNaN(accountId as number)) {
      accountId = null;
    } 
    this.accounId = accountId;
    if (this.dataForm.get('ProjectId')) {
      this.dataForm.get('ProjectId')?.setValue(null);
      this.dataForm.get('ProjectName')?.setValue(null);
      this.dataForm.get('ProjectId')?.markAsTouched();
    }
    this.ProjectList = [];
    this.GetProjectListbyEmpId();
  }
  onSelectProj(event: any): void {
    let projectId: number | null = null;  
    if (event === null || event === undefined) {
      projectId = null;
    } else if (typeof event === 'number' || typeof event === 'string') {
      projectId = Number(event);
    } else if (Array.isArray(event)) {
      const first = event[0];
      projectId = first == null ? null
        : (typeof first === 'object' ? Number(first.ProjectId ?? first.projectId ?? first) : Number(first));
    } else if (typeof event === 'object') {
      projectId = Number(event.ProjectId ?? event.projectId ?? event.Id ?? event.value ?? NaN);
    } else {
      projectId = Number(event);
    }
    if (isNaN(projectId as number)) {
      projectId = null;
    } 
    if (this.dataForm.get('ResponsiblePersonId')) {
      this.dataForm.get('ResponsiblePersonId')?.setValue(null);
      this.dataForm.get('ResponsiblePerson')?.setValue(null);
      this.dataForm.get('ResponsiblePersonId')?.markAsTouched();
    }
    this.ResponsiblePersonList = [];
    this.projectId = projectId;
    this.GetPersonsListbyProjId();
  }
  GetPersonsListbyProjId(){
    try {

      const projectId = this.projectId;
      this.alertModuleService.GetPersonsListbyProjId(projectId).subscribe((response: any) => {
        this.ResponsiblePersonList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: any) => ({
            ResponsiblePersonId: (it.EmployeeId ?? it.employeeId ?? null),
            ResponsiblePerson: (it.EmployeeName ?? it.employeeName ?? `Employee ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      console.error(e);
    }
  }
  GetProjectListbyEmpId(){
    try {
      const accounId = this.accounId;
      this.alertModuleService.GetProjectbyEmpId(accounId).subscribe((response: any) => {
        this.ProjectList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            ProjectId: (it.ProjectId ?? it.projectId ?? null),
            ProjectName: (it.ProjectName ?? it.projectName ?? `Project ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      console.error(e);
    }
  }
  GetAccountListbyEmpId(){
    try {
      this.isLoadingAccounts = true;
      this.alertModuleService.GetAccountListbyEmpId().subscribe((response: any) => {
        console.log('raw AccountList response:', response);
        this.AccountList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            AccountId: (it.AccountId ?? it.accountId ?? it.MastCustId ?? null),
            AccountName: (it.AccountName ?? it.accountName ?? it.MastCustName ?? `Account ${idx + 1}`),
            raw: it
          }));
        console.log('normalized AccountList:', this.AccountList);
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      this.isLoadingAccounts = false;
      console.error(e);
    }
  }
  GetEscalationType(){
    try {
      this.isLoadingAccounts = true;
      const IsFilterData = false;
      this.alertModuleService.GetEscalationType(IsFilterData).subscribe((response: any) => {
        this.EscalationTypeList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            EscalationTypeId: (it.EscalationTypeId ?? it.escalationTypeId ?? null),
            EscalationType: (it.Type ?? it.type ?? `Type ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      this.isLoadingAccounts = false;
    }
  }
  GetEscalationCategory(){
    try {
      this.isLoadingAccounts = true;
      const IsFilterData = false;
      this.alertModuleService.GetEscalationCategory(IsFilterData).subscribe((response: any) => {
        this.EscalationCategoryList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            EscalationCategoryId: (it.EscalationCategoryId ?? it.escalationCategoryId ?? null),
            EscalationCategory: (it.Category ?? it.category ?? `Category ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      this.isLoadingAccounts = false;
    }
  }
  GetEscalationPriority(){
    try {
      this.isLoadingAccounts = true;
      const IsFilterData = false;
      this.alertModuleService.GetEscalationPriority(IsFilterData).subscribe((response: any) => {
        this.PriorityList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            EscalationPriorityId: (it.EscalationPriorityId ?? it.escalationPriorityId ?? null),
            EscalationPriority: (it.Priority ?? it.priority ?? `priority ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      this.isLoadingAccounts = false;
    }
  }
  onSave(): void {
    // validate form correctly
    if (!this.dataForm || !this.dataForm.valid) {
      this.dataForm?.markAllAsTouched();
      this.toastService.showError('Please enter all mandatory fields.', 'Validation');
      return;
    }

    const v = this.dataForm.getRawValue();
    console.log('v',v)
    const toNumberOrNull = (x: any) => {
      if (x === null || x === undefined || x === '') return null;
      const n = Number(x);
      return isNaN(n) ? null : n;
    };

    const escalationIdFromForm = toNumberOrNull(this.dataForm.get('EscalationManagementId')?.value) ?? toNumberOrNull(this.currentEscalationId);

    const model: any = {
      EscalationManagementId: escalationIdFromForm ?? 0,
      ProjectId: toNumberOrNull(v.ProjectId) ?? 0,
      AccountId: toNumberOrNull(v.AccountId) ?? 0,
      ProjectName: v.ProjectName ?? null,
      AccountName: v.AccountName ?? null,
      Title: (v.Title ?? '').toString().trim(),
      Description: v.Description ?? null,
      EscalationTypeId: toNumberOrNull(v.EscalationTypeId) ?? 0,
      EscalationType: v.EscalationType ?? null,
      EscalationCategoryId: toNumberOrNull(v.EscalationCategoryId) ?? 0,
      EscalationCategory: v.EscalationCategory ?? null,
      EscalationPriorityId: v.EscalationPriorityId ?? null,
      EscalationPriority: v.EscalationPriority ?? null,
      ResponsiblePersonId: (v.ResponsiblePersonId ?? '').toString().trim(),
      ResponsiblePerson: v.ResponsiblePerson ?? null,
      TargetResolutionDate: this.formatDateOnly(v.TargetResolutionDate),    
      Status: v.Status ?? null,
      RecordVersion: this.recordVersionBase64 ?? null,
      EscalatedBy: (v.EscalatedBy ?? '').toString().trim(),
      DesignationOfThePerson: (v.DesignationOfThePerson ?? '').toString().trim(),
      EscalationDate: this.formatDateOnly(v.EscalationDate),
    };
    console.log('onSave - model', model);
    const formData = new FormData();
    formData.append('escalationAlert', JSON.stringify(model));
    if (this.selectedFiles && this.selectedFiles.length) {
      this.selectedFiles.forEach((f) => formData.append('files', f, f.name));
    }
    const keptExistingFiles = (this.existingAttachments || []).map(a => a.name).filter(n => n);
    formData.append('existingFiles', JSON.stringify(keptExistingFiles));
    if (this.removedExistingFiles && this.removedExistingFiles.length) {
      formData.append('removedFiles', JSON.stringify(this.removedExistingFiles));
    }
    if (this.recordVersionBase64) {
      formData.append('RecordVersion', this.recordVersionBase64);
    }

    // Submit or Update
    const hasValidId = model.EscalationManagementId != null && model.EscalationManagementId > 0;
    if (this.isEditMode || hasValidId) {
      this.alertModuleService.UpdateAlertDetails(formData).subscribe({
        next: (res: any) => {
          this.toastService.showSuccess('Alert updated successfully', 'Success');
          this.goBack();
        },
        error: (err: any) => {
          console.error('Update failed', err);
          this.toastService.showError('Failed to update alert', 'Error');
        }
      });
    } else {
      this.alertModuleService.SubmitAlertDetails(formData).subscribe({
        next: (res: any) => {
          this.toastService.showSuccess('Alert saved successfully', 'Success');
          this.goBack();
        },
        error: (err: any) => {
          console.error('Save failed', err);
          this.toastService.showError('Failed to save alert', 'Error');
        }
      });
    }
  }

  convertFileArrayToFileList(files: File[]): FileList {
    const fileArray = Array.from(files);
    const fileUpload = new DataTransfer();
    fileArray.forEach((file: File) => {
      fileUpload.items.add(file);
    });
    return fileUpload.files;
  }
  onFileChange(event) {
    debugger;
    const files = (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const filesArray: File[] = Array.from(files);
      this.selectedFiles.push(...filesArray);
    }
  }
  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = Math.max(0, decimals);
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    let totalSize = 0;
    for (let i = 0; i < input.files.length; i++) totalSize += input.files[i].size;
    const MAX_TOTAL = 14 * 1024 * 1024;
    if (totalSize > MAX_TOTAL) {
      this.toastService.showError('Total selected files exceed 14 MB limit', 'Error');
      return;
    }
    const newFiles: File[] = Array.from(input.files);
    for (const nf of newFiles) {
      const exists = this.selectedFiles.some(sf => sf.name === nf.name && sf.size === nf.size && sf.lastModified === nf.lastModified);
      if (!exists) this.selectedFiles.push(nf);
    }
    if (this.dataForm && this.dataForm.get('files')) {
      this.dataForm.get('files')?.setValue(this.selectedFiles);
    }
    input.value = '';
    this.onSelectFiles.emit(this.selectedFiles);
  }
  openFile(file: File): void {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  removeFile(index: number): void {
    if (index < 0 || index >= this.selectedFiles.length) return;
    this.selectedFiles.splice(index, 1);
    if (this.dataForm && this.dataForm.get('files')) {
      this.dataForm.get('files')?.setValue(this.selectedFiles);
    }
    this.onSelectFiles.emit(this.selectedFiles);
  }
// #region Target Resolution Date Calculation

private addWorkingDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let added = 0;

  while (added < days) {

    // Move to next day
    result.setDate(result.getDate() + 1);

    // Check weekend on updated date
    const dayOfWeek = result.getDay();

    // 0 = Sun, 6 = Sat
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }

  return result;
}
private calculateTargetResolutionDate(): void {
  try {
    const priority = this.dataForm.get('EscalationPriorityId')?.value;

    if (!priority) {
      this.workingDaysTooltip = '';
      return;
    }

    // ALWAYS use current date (today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const slaById: Record<number, number> = {
      1: 2,   // Critical
      2: 4,   // High
      3: 5,   // Medium
      4: 10   // Low
    };

    const workingDays = slaById[priority];
    if (!workingDays) {
      this.workingDaysTooltip = '';
      return;
    }

    // Calculate from NEXT working day
    const targetDate = this.addWorkingDays(today, workingDays);

    this.dataForm.patchValue({
      TargetResolutionDate: targetDate
    });

    this.workingDaysTooltip =
      `Priority ${priority} → ${workingDays} working day${workingDays > 1 ? 's' : ''} (Sat/Sun excluded)`;

  } catch (e) {
    console.error('calculateTargetResolutionDate error', e);
  }
}


  // #Endregion Target Resolution Date Calculation
  openExistingFile(filename: string, url?: string): void {
    if (url) {
      window.open(url, '_blank');
      return;
    }
    this.openuploadDocumnet(filename);
  }
  openuploadDocumnet(fileName) {
    var FileName = fileName;
    const payload  = {
      EscalationManagementId: Number(this.alertManagementId),
      FileName: FileName
    }
    this.alertModuleService.getUploadFIle(payload).subscribe((response: any) => {
      const contentType = this.getContentTypeFromExtension(fileName);

      debugger;
      const blob = new Blob([response.body], { type: contentType });
      var downloadURL = window.URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = downloadURL;
      link.name = FileName;
      link.title = FileName;
      link.download = FileName;
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
      case 'docx':
        return 'application/msword';
      case 'txt':
        return 'text/plain';
      default:
        return null; 
    }
  }
  private getFileExtension(fileName: string): string {
    return fileName.split('.').pop();
  }
  goBack() {
    this.router.navigate(['/alert-module']);
  }
  removeExistingAttachment(identifier: string): void {
    try {
      if (!identifier) return;
  
      // find index by name
      const index = this.existingAttachments.findIndex(a => a.name === identifier);
      if (index < 0) {
        // not found — nothing to do
        console.warn('removeExistingAttachment: file not found in existingAttachments', identifier);
        return;
      }
  
      // remove from local list and keep track of removed names for server
      const removed = this.existingAttachments.splice(index, 1)[0];
      if (removed && removed.name) {
        this.removedExistingFiles = this.removedExistingFiles || [];
        this.removedExistingFiles.push(removed.name);
      }
  
      // call server to delete attachment

      const fileName = identifier;
      const EscalationManagementId = this.managmentid || this.alertManagementId || 0;
  
      // Defensive: ensure required params exist
      if (!fileName || !EscalationManagementId) {
        console.warn('removeExistingAttachment: missing parameters for server call', {fileName, EscalationManagementId });
        return;
      }
  
      this.alertModuleService.DeleteAttachment(fileName, EscalationManagementId).subscribe({
        next: (res: any) => {
          // optionally show success toast (uncomment if desired)
          // this.toastService.showSuccess('Attachment deleted', 'Success');
        },
        error: (err: any) => {
          console.error('Delete failed', err);
          this.toastService.showError('Failed to delete attachment', 'Error');
          // On failure you might want to put the attachment back in the list:
          this.existingAttachments.splice(index, 0, removed);
          // remove the last pushed removed file if it exists
          const pos = this.removedExistingFiles.indexOf(removed.name);
          if (pos >= 0) this.removedExistingFiles.splice(pos, 1);
        }
      });
    } catch (e) {
      console.error('removeExistingAttachment error', e);
    }
  }
  isInvalid(controlName: string): boolean {
    const c = this.dataForm.get(controlName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }  
  private touchAllControls(form: FormGroup) {
    Object.keys(form.controls).forEach(name => {
      form.get(name)?.markAsTouched();
      form.get(name)?.markAsDirty();
    });
  }
  focusFirstInvalidControl() {
    const controls: NodeListOf<HTMLElement> = this.elRef.nativeElement.querySelectorAll('[formControlName]');
  
    for (let i = 0; i < controls.length; i++) {
      const el = controls[i];
      const name = el.getAttribute('formControlName') || '';
      const control = this.dataForm.get(name);
  
      if (!control) continue;
  
      if (control.invalid) {
        control.markAsTouched();
        control.markAsDirty();
        try {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {
        }
        if (el.tagName.toLowerCase() === 'ng-select') {
          const container: HTMLElement | null = el.querySelector('.ng-select-container');
  
          if (container) {
            if (!container.hasAttribute('tabindex')) {
              this.renderer.setAttribute(container, 'tabindex', '0');
            }
            try { container.focus(); } catch (e) { /* ignore */ }
          } else {
            try { (el as HTMLElement).focus(); } catch (e) { /* ignore */ }
          }
        } else {
          try {
            if (!el.hasAttribute('tabindex')) {
              this.renderer.setAttribute(el, 'tabindex', '-1');
              (el as HTMLElement).focus();
              this.renderer.removeAttribute(el, 'tabindex');
            } else {
              (el as HTMLElement).focus();
            }
          } catch (e) {
          }
        }
        return;
      }
    }
  }
  get form():FormGroup{
    return this.dataForm;
  }
  setEscalationDateLimit() {
    const today = new Date();
  
    // Allow any past date → no minDate
    this.minEscalationDate = undefined as any;
  
    // Block future dates → max = today
    this.maxEscalationDate = this.endOfDay(today);
  
    this.escalationDateErrorMessage = 'Future dates are not allowed';
  }  
  
  private setupEscalationDateValidation(): void {
    const ctrl = this.dataForm.get('EscalationDate');
    if (!ctrl) return;
  
    // validate immediately if there's an existing value
    setTimeout(() => this.validateEscalationDateValue(ctrl.value), 0);
  
    ctrl.valueChanges.subscribe((val: any) => {
      this.validateEscalationDateValue(val);
    });
  }
  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
  }
  
  private endOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }
  
  private asDateOnly(d: any): Date | null {
    if (!d) return null;
    if (d instanceof Date) return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return null;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }
  
  private validateEscalationDateValue(value: any): void {

    // Do NOT validate existing date in Edit mode
    if (this.isEditMode && this.currentEscalationId) {
      this.showEscalationDateMessage = '';
      this.dataForm.get('EscalationDate')?.setErrors(null);
      return;
    }
  
    if (!value) {
      this.showEscalationDateMessage = '';
      this.dataForm.get('EscalationDate')?.setErrors(null);
      return;
    }
  
    const selectedDate = this.asDateOnly(value);
    if (!selectedDate) {
      this.dataForm.get('EscalationDate')?.setErrors({ invalidDate: true });
      this.showEscalationDateMessage = 'Invalid date';
      return;
    }
  
    const today = this.startOfDay(new Date());

    if (selectedDate > today) {
      this.dataForm.get('EscalationDate')?.setErrors({ futureDate: true });
      this.showEscalationDateMessage = 'Future dates are not allowed';
      return;
    }
  
    this.showEscalationDateMessage = '';
    this.dataForm.get('EscalationDate')?.setErrors(null);
  }  
  private toDateOnly(value: any): Date | null {
    if (!value) return null;
  
    // Already a Date
    if (value instanceof Date) {
      return new Date(
        value.getFullYear(),
        value.getMonth(),
        value.getDate()
      );
    }
  
    // ISO string: 2025-12-15T00:00:00 or 2025-12-15
    if (typeof value === 'string') {
      const isoDatePart = value.split('T')[0]; // ✅ remove time
      const parts = isoDatePart.split('-');
  
      if (parts.length === 3) {
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        const d = Number(parts[2]);
  
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new Date(y, m - 1, d);
        }
      }
    }
  
    // fallback
    const dt = new Date(value);
    return isNaN(dt.getTime())
      ? null
      : new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  }
  
  private formatDateOnly(date: Date): string {
    const y = date.getFullYear();
    const m = ('0' + (date.getMonth() + 1)).slice(-2);
    const d = ('0' + date.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
  }

}
