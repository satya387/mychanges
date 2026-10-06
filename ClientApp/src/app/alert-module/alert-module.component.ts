import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import Modal from 'bootstrap/js/dist/modal'; // Bootstrap 5 Modal API
import { Router } from '@angular/router';
import { AlertModuleService } from './alert-module.service';
import { DatePipe } from '@angular/common';
import { ToastService } from 'src/app/common/toast/toast.service';
import { FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { AlertFilterComponent } from '../alert-module/alert-filter/alert-filter.component';
interface AlertModel {
  EscalationManagementId: number;
  ProjectName: string;
  AccountName: string;
  Title: string;
  EscalatedBy:string;
  Description: string;
  EscalationTypeId: number;
  EscalationType: string;
  EscalationCategoryId: number;
  EscalationCategory: string;
  EscalationPriority: 'High' | 'Medium' | 'Low' | string;
  ResponsiblePersonId: string;
  ResponsiblePerson: string;
  EscalationDate: string;
  DateLogged: string;
  TargetResolutionDate: string;
  ActualResolutionDate?: string;
  RecordVersion?: any;
  Attachments?: { name: string; url?: string }[];
  AccountId?: number | string | null;
  ProjectId?: number | string | null;
  Status?: string;
  EscalationPriorityId: number;
}

@Component({
  selector: 'app-alert-module',
  templateUrl: './alert-module.component.html',
  styleUrls: ['./alert-module.component.scss']
})
export class AlertModuleComponent implements OnInit, AfterViewInit, OnDestroy {
  alerts: AlertModel[] = [];
  filteredAlerts: AlertModel[] = [];

  AccountList: Array<{ AccountId: number | string | null; AccountName: string; raw?: any }> = [];
  ProjectList: Array<{ ProjectId: number | string | null; ProjectName: string; raw?: any }> = [];
  selectedProjectId: number | null = null;
  accounId: number | null = null;
  projectId: number | null = null;
  Status: any = null;

  accountControl = new FormControl(null);
  projectControl = new FormControl(null);

  @ViewChild('vacancyTable', { static: false }) table!: ElementRef;
  dtInstance: any;

  isLoadingAccounts = false;
  toDeleteItem: AlertModel | null = null;
  isDeleting = false;
  filters = {
    accountIds: [] as number[],
    projectIds: [] as number[],
    alertTypes: [] as number[],
    priorities: [] as number[],
    statuses: [] as string[],
    Categories: [] as number[]
  };
  
  // Bootstrap modal instance
  private deleteModalInstance: any = null;

  // Live search
  private accountSearch$ = new Subject<string>();
  private projectSearch$ = new Subject<string>();
  private searchSubs = new Subscription();

  constructor(
    private router: Router,
    private alertModuleService: AlertModuleService,
    private toastService: ToastService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {}

  // ----------------- LIFECYCLE -----------------
  ngOnInit(): void {
    this.setupSearchStreams();
    this.GetAccountProjectListbyEmpId(null, '');
    this.loadAlerts(0, 0);
  }
  

  ngAfterViewInit(): void {
    this.loadAlerts(0, 0);
  }
  private setupSearchStreams(): void {
  // const userData = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
  // const empEmidsId = userData.EmployeeId;

  // DISTINCT ACCOUNT FILTER
  const distinctAccounts = (list: any[]) => {
    const seen = new Set();
    return list.filter(a => {
      const id = a.AccountId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // DISTINCT PROJECT FILTER
  const distinctProjects = (list: any[]) => {
    const seen = new Set();
    return list.filter(p => {
      const id = p.ProjectId;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  // Account search stream
  const accSub = this.accountSearch$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      const t = (term || '').trim();
      if (t.length == 0){
        return this.alertModuleService.GetAccountProjectListbyEmpId(0, '').pipe(
          catchError(() => of([]))
        );
      }
      else if (t.length < 3)  return of([]);
      return this.alertModuleService.GetAccountProjectListbyEmpId(0, t).pipe(
        catchError(() => of([]))
      );
    })
  ).subscribe((response: any) => {
    const rawList = Array.isArray(response) ? response : response?.data ?? [];

    // BIND DISTINCT ACCOUNTS
    this.AccountList = distinctAccounts(
      rawList.map((it: any, idx: number) => ({
        AccountId: it.AccountId ?? it.MastCustId ?? it.accountId ?? null,
        AccountName: it.AccountName ?? it.MastCustName ?? it.accountName ?? `Account ${idx + 1}`,
        raw: it
      }))
    );

    // BIND DISTINCT PROJECTS
    this.ProjectList = distinctProjects(
      rawList.map((it: any, idx: number) => ({
        ProjectId: it.ProjectId ?? it.projectId ?? null,
        ProjectName: it.ProjectName ?? it.projectName ?? `Project ${idx + 1}`,
        raw: it
      }))
    );
  });

  // Project search stream
  const projSub = this.projectSearch$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(term => {
      const t = (term || '').trim();
      if (t.length < 3) return of([]);
      const accIdForApi = this.accounId === null || this.accounId === undefined ? 0 : this.accounId;
      return this.alertModuleService.GetAccountProjectListbyEmpId(accIdForApi, t).pipe(
        catchError(() => of([]))
      );
    })
  ).subscribe((response: any) => {
    const rawList = Array.isArray(response) ? response : response?.data ?? [];

    // BIND DISTINCT PROJECTS
    this.ProjectList = distinctProjects(
      rawList.map((it: any, idx: number) => ({
        ProjectId: it.ProjectId ?? it.projectId ?? null,
        ProjectName: it.ProjectName ?? it.projectName ?? `Project ${idx + 1}`,
        raw: it
      }))
    );
  });

  this.searchSubs.add(accSub);
  this.searchSubs.add(projSub);
}

  onAccountSearch(eventOrTerm: string | { term?: string } | any): void {
    let term = '';
  
    if (typeof eventOrTerm === 'string') {
      term = eventOrTerm;
    } else if (eventOrTerm && typeof eventOrTerm.term === 'string') {
      term = eventOrTerm.term;
    } else if (eventOrTerm && typeof eventOrTerm === 'object') {
      term = eventOrTerm.term ?? eventOrTerm.search ?? '';
    }
  
    this.accountSearch$.next(term);
  }
  
 
onProjectSearch(eventOrTerm: string | { term?: string } | any): void {
  let term = '';

  if (typeof eventOrTerm === 'string') {
    term = eventOrTerm;
  } else if (eventOrTerm && typeof eventOrTerm.term === 'string') {
    term = eventOrTerm.term;
  } else if (eventOrTerm && typeof eventOrTerm === 'object') {
    term = eventOrTerm.term ?? eventOrTerm.search ?? '';
  }

  this.projectSearch$.next(term);
}

  // ----------------- DATA LOADING -----------------
  private loadAlerts(accountId?: number | null, projectId?: number | null): void {
    const accId = accountId ?? 0;
    const projId = projectId ?? 0;

    const requestBody = {
      accountId:  [],
      projectId: [],
       alertType:  [],
      alertPriority : [],
      alertStatus:  [],
      alertCategory:  []
    };

    this.alertModuleService.getAlertDetails(requestBody).subscribe(
      (data: any[]) => {
        const rawList = Array.isArray(data) ? data : data ?? [];
        this.alerts = (rawList || []).map((d) => this.mapApiToModel(d));
        this.filteredAlerts = [...this.alerts];
        this.Status = this.alerts[0]?.Status ?? null;
        this.initOrUpdateDataTable();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  // ----------------- DATATABLE -----------------
  private initOrUpdateDataTable(): void {
    if (!this.table || !this.table.nativeElement) return;

    const tableElement = $(this.table.nativeElement);

    if (!this.dtInstance) {
      this.dtInstance = tableElement.DataTable({
        data: this.filteredAlerts,
        pageLength: 10,
        lengthChange: false,
        searching: false,
        ordering: true,
        autoWidth: true,
        deferRender: false,
        scrollX: false,
        columns: [
          { data: 'AccountName', width: '110px',
            render: (data: any, type: any, row: any) => {
              if (type === 'display') {
                return `<span class="PRText" title="${this.escapeHtml(row.AccountName)}">${this.escapeHtml(
                  row.AccountName
                )}</span>`;
              }
              return data;
            }
           },
          { data: 'ProjectName', width: '110px',
            render: (data: any, type: any, row: any) => {
              if (type === 'display') {
                return `<span class="PRText" title="${this.escapeHtml(row.ProjectName)}">${this.escapeHtml(
                  row.ProjectName
                )}</span>`;
              }
              return data;
            }
           },
          // { data: 'Title', width: '120px',
          //   render: (data: any, type: any, row: any) => {
          //     if (type === 'display') {
          //       return `<span class="PRText" title="${this.escapeHtml(row.Title)}">${this.escapeHtml(
          //         row.Title
          //       )}</span>`;
          //     }
          //     return data;
          //   }
          //  },
          {
            data: 'Description',
            width: '150px',
            render: (data: any, type: any, row: any) => {
              if (type === 'display') {
                return `<span class="PRText" title="${this.escapeHtml(row.Description)}">${this.escapeHtml(
                  row.Description
                )}</span>`;
              }
              return data;
            }
          },
          { data: 'EscalationType', width: '120px' },
          // { data: 'EscalationCategory', width: '110px' },
          {
            data: 'EscalationPriority',
            width: '110px',
            render: (data: any, type: any, row: any) => {
              const level = row.EscalationPriorityId || '0';
          
              return `
                <span class="priority" data-priority="${this.escapeHtml(String(level))}">
                  ${this.escapeHtml(data)}
                </span>
              `;
            }
          }
          ,
          { data: 'EscalatedBy', width: '110px' },
          { data: 'DateLogged', width: '110px' },
          { data: 'EscalationDate', width: '110px' },
          { data: 'TargetResolutionDate', width: '110px' },
          { data: 'Status', width: '80px' },
          { data: 'ResponsiblePerson', width: '150px' },
          {
            data: null,
            width: '60px',
            orderable: false,
            className: 'Attachment',
            render: (_data: any, _type: any, row: AlertModel) => {
              const escId = this.escapeHtml(String(row.EscalationManagementId ?? ''));
              const attachments = Array.isArray(row.Attachments) ? row.Attachments : [];
          
              const items = attachments.length > 0
                ? attachments.map(a => {
                    const fileName = this.escapeHtml(a.name || 'Attachment');
                    return `
                      <a href="javascript:void(0)"
                         class="dropdown-item attachment-download"
                         data-filename="${fileName}"
                         data-escalationmanagementid="${escId}">
                         ${fileName}
                      </a>`;
                  }).join('')
                : `<span class="dropdown-item disabled">No attachments</span>`;
          
              return `
                <a href="javascript:void(0)" class="attachment-link">
                  <img src="../../../assets/images/File-download.png" width="20" height="20" />
                </a>
                <div class="dropdown-menu">
          
                  ${attachments.length > 0 ? `
                    <a href="javascript:void(0)"
                       class="dropdown-item download-all"
                       data-escalationmanagementid="${escId}">
                       ⬇️ Download All
                    </a>
                    <div class="dropdown-divider"></div>
                  ` : ''}
          
                  ${items}
                </div>
              `;
            }
          }          
          ,          
          {
            data: null,
            width: '110px',
            orderable: false,
            className: 'action-column',
            render: (_data: any, _type: any, row: any) => {
              return `
                <div class="action-wrapper">
                  <button class="ellipsis-btn action-toggle" data-id="${row.EscalationManagementId}" aria-haspopup="true" aria-expanded="false">
                    ⋯
                  </button>

                  <div class="action-menu d-none" role="menu" aria-hidden="true">
                  <button class="menu-btn Action-btn" data-id="${row.EscalationManagementId}">📝 Resolution</button>
                    ${
                      row.Status !== 'Closed'
                        ? `<button class="menu-btn edit-btn" data-id="${row.EscalationManagementId}">✏️ Edit</button>`
                        : ''
                    }
                    <button class="menu-btn delete-btn" data-id="${row.EscalationManagementId}">🗑️ Delete</button>
                  </div>
                </div>
              `;
            }
          }
        ]
      });

      const component = this;

      tableElement.on('click', '.Action-btn', function (event) {
        const $btn = $(event.currentTarget);
        const rowData = component.dtInstance.row($btn.closest('tr')).data() as AlertModel;
        if (rowData) {
          component.navigate(rowData, 1);
        }
      });
      tableElement.on('click', '.edit-btn', function (event) {
        const $btn = $(event.currentTarget);
        const rowData = component.dtInstance.row($btn.closest('tr')).data() as AlertModel;
        if (rowData) {
          component.navigateTo(rowData, 1);
        }
      });

      tableElement.on('click', '.delete-btn', function (event) {
        const $btn = $(event.currentTarget);
        const rowData = component.dtInstance.row($btn.closest('tr')).data() as AlertModel;
        if (rowData) {
          component.confirmDeletePrompt(rowData);
        }
      });

      tableElement.on('click', '.attachment-link', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const $cell = $(this).closest('td.Attachment');
        tableElement.find('td.Attachment.open').not($cell).removeClass('open');
        $cell.toggleClass('open');
      });

      $(document).on('click.alert-attachment', (event) => {
        const $target = $(event.target);
        if (!$target.closest('td.Attachment').length) {
          $(tableElement).find('td.Attachment.open').removeClass('open');
        }
      });

      tableElement.on('click', '.attachment-download', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const $el = $(this);
        const fileName = $el.data('filename');
        const escalationIdRaw = $el.data('escalationmanagementid');

        if (!fileName) return;

        const escalationId = escalationIdRaw == null ? undefined : Number(escalationIdRaw);
        component.openExistingFile(String(fileName), escalationId);
      });

      tableElement.on('click', '.action-toggle', function (event) {
        event.stopPropagation();
        const $btn = $(event.currentTarget);
        const $wrapper = $btn.closest('.action-wrapper');
        const $menu = $wrapper.find('.action-menu');

        tableElement.find('.action-menu').not($menu).addClass('d-none');
        $menu.toggleClass('d-none');
      });

      tableElement.on('click', '.action-menu', function (e) {
        e.stopPropagation();
      });
      tableElement.on('click', '.download-all', function (event) {
        event.preventDefault();
        event.stopPropagation();
      
        const escId = Number($(this).data('escalationmanagementid'));
        if (!escId) return;
      
        component.downloadAllAttachments(escId);
      });
      
      $(document).on('click.action-menu', function (e) {
        if (!$(e.target).closest('.action-wrapper').length) {
          tableElement.find('.action-menu').addClass('d-none');
        }
      });

      return;
    }

    // Update existing DataTable with new data
    $(this.table.nativeElement).find('.action-menu').addClass('d-none');
    this.dtInstance.clear();
    this.dtInstance.rows.add(this.filteredAlerts);
    this.dtInstance.draw();
    console.log('DataTable updated with new data');
  }

  // ----------------- UI ACTIONS -----------------
  navigateTo(data?: any, isEdit?: number): void {
    if (data && (isEdit === 1 || isEdit === undefined)) {
      this.router.navigate(['create-alert'], {
        queryParams: {
          isAdd: 'false',
          id: data.EscalationManagementId ?? data.id ?? 0,
          isEdit: '1'
        }
      });
    } else {
      this.router.navigate(['create-alert'], {
        queryParams: {
          isAdd: 'true',
          id: 0,
          isEdit: '0'
        }
      });
    }
  }
  navigate(data?: any, isEdit?: number): void {
      this.router.navigate(['action-alert'], {
        queryParams: {
          id: data.EscalationManagementId ?? data.id ?? 0
        }
      });
  }
  // ----------------- DELETE FLOW -----------------
  delete(data?: any): void {
    if (!data) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete alert "${data.Title ?? data.EscalationManagementId}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    const model: any = {
      IsDelete: true
    };
    const formData = new FormData();
    formData.append('escalationAlert', JSON.stringify(model));

    this.alertModuleService.UpdateAlertDetails(formData).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Deleted successfully', 'Success');
        this.loadAlerts(this.accounId ?? 0, this.projectId ?? 0);
      },
      error: (err: any) => {
        console.error('Delete failed', err);
        this.toastService.showError('Failed to delete alert', 'Error');
      }
    });
  }
// inside your component class
projectSearchFn = (term: string, item: any): boolean => {
  try {
    if (!term) return false;
    const trimmed = (term || '').toString().trim();
    if (trimmed.length < 3) return false;

    const normalize = (s: any) => {
      if (s == null) return '';
      return s
        .toString()
        .normalize('NFKD')                    // decompose accents
        .replace(/[\u0300-\u036f]/g, '')      // remove accent marks
        .replace(/[^a-zA-Z0-9\s]/g, ' ')      // replace punctuation like &,/,-,() with space
        .replace(/\s+/g, ' ')                 // collapse multiple spaces
        .trim()
        .toLowerCase();
    };

    const nameNorm = normalize(item?.ProjectName ?? item?.projectName ?? '');
    const termNorm = normalize(trimmed);

    // token based: each token typed must appear somewhere in the project name
    const tokens = termNorm.split(' ').filter(t => t.length > 0);
    if (tokens.length === 0) return false;

    return tokens.every(tok => nameNorm.indexOf(tok) !== -1);
  } catch (err) {
    const n = (item?.ProjectName ?? '').toString().toLowerCase();
    return n.includes((term || '').toString().toLowerCase());
  }
};

  // ----------------- DROPDOWNS -----------------
  onSelectAccountProject(event: any): void {
    let accountId: number | null = null;

    if (event === null || event === undefined) {
      accountId = null;
    } else if (typeof event === 'number' || typeof event === 'string') {
      accountId = Number(event);
    } else if (Array.isArray(event)) {
      const first = event[0];
      accountId =
        first == null
          ? null
          : typeof first === 'object'
          ? Number(first.AccountId ?? first.accountId ?? first)
          : Number(first);
    } else if (typeof event === 'object') {
      accountId = Number(
        event.AccountId ?? event.accountId ?? event.Id ?? event.value ?? NaN
      );
    } else {
      accountId = Number(event);
    }

    if (isNaN(accountId as number)) {
      accountId = null;
    }

    this.accounId = accountId;
    this.selectedProjectId = null;
    this.projectId = null;

    if (this.projectControl) {
      this.projectControl.setValue(null, { emitEvent: false });
    }
    this.GetAccountProjectListbyEmpId(this.accounId);
    this.loadAlerts(this.accounId ?? 0, this.projectId ?? 0);
  }

  onProjectSelect(event: any): void {
    if (event === null || event === undefined) {
      this.projectId = null;
      this.selectedProjectId = null;
      if (this.projectControl) {
        this.projectControl.setValue(null, { emitEvent: false });
      }
      this.loadAlerts(this.accounId ?? 0, 0);
      return;
    }
  
    let projectId: number | null = null;
  
    if (typeof event === 'number' || typeof event === 'string') {
      projectId = Number(event);
    } else if (Array.isArray(event)) {
      const first = event[0];
      projectId =
        first == null
          ? null
          : typeof first === 'object'
          ? Number(first.ProjectId ?? first.projectId ?? first)
          : Number(first);
    } else if (typeof event === 'object') {
      projectId = Number(event.ProjectId ?? event.projectId ?? event.Id ?? event.value ?? NaN);
    } else {
      projectId = Number(event);
    }
  
    if (isNaN(projectId as number)) projectId = null;
  
    this.projectId = projectId;
    this.selectedProjectId = projectId;
  
    // find selected project (match by id primarily)
    let selectedProject: any = null;
    if (projectId != null) {
      selectedProject = this.ProjectList.find((p: any) => {
        if (!p) return false;
        const pId = p.ProjectId ?? p.projectId;
        return pId != null && Number(pId) === Number(projectId);
      });
    }
  
    // if not found by id, try object event or name match
    if (!selectedProject && event && typeof event === 'object') {
      const maybeId = event.ProjectId ?? event.projectId ?? null;
      const maybeName = event.ProjectName ?? event.projectName ?? null;
      if (maybeId) {
        selectedProject = this.ProjectList.find((p: any) => Number(p.ProjectId) === Number(maybeId));
      } else if (maybeName) {
        selectedProject = this.ProjectList.find((p: any) => String(p.ProjectName).trim() === String(maybeName).trim());
      }
    } else if (!selectedProject && typeof event === 'string') {
      selectedProject = this.ProjectList.find((p: any) => String(p.ProjectName).trim() === String(event).trim());
    }
  
    // derive owning account info
    const derivedAccountId = selectedProject ? (selectedProject.AccountId ?? selectedProject.raw?.AccountId ?? selectedProject.raw?.MastCustId ?? null) : null;
    const derivedAccountName = selectedProject ? (selectedProject.AccountName ?? selectedProject.raw?.AccountName ?? selectedProject.raw?.MastCustName ?? null) : null;
  
    if (derivedAccountId != null) {
      const acctIdNum = Number(derivedAccountId);
      if (!isNaN(acctIdNum)) {
        this.accounId = acctIdNum;
  
        // ensure AccountList contains this account so ng-select can display it
        const accountExists = this.AccountList.some(a => (a.AccountId != null && Number(a.AccountId) === acctIdNum) || String(a.AccountName).trim() === String(derivedAccountName ?? '').trim());
        if (!accountExists) {
          this.AccountList = [
            ...(this.AccountList || []),
            { AccountId: acctIdNum, AccountName: derivedAccountName ?? `Account ${acctIdNum}`, raw: selectedProject?.raw ?? selectedProject }
          ];
        }
  
        // set the accountControl value without emitting change event (prevents fetch loops)
        if (this.accountControl) {
          this.accountControl.setValue(acctIdNum, { emitEvent: false });
        }
      }
    } else {
      this.accounId = null;
      if (this.accountControl) {
        this.accountControl.setValue(null, { emitEvent: false });
      }
    }
  
    // finally load filtered alerts
    this.loadAlerts(this.accounId ?? 0, this.projectId ?? 0);
  }      
  // ----------------- SERVICE CALLS -----------------
  GetAccountProjectListbyEmpId(accountId: number | null, searchText: string = ''): void {
    try {
      const accIdForApi = accountId === null || accountId === undefined ? 0 : accountId;
  
      this.alertModuleService.GetAccountProjectListbyEmpId(accIdForApi, searchText).subscribe(
        (response: any) => {
          // Normalize response -> flat array of rows
          let rawList: any[] = [];
          if (Array.isArray(response)) rawList = response;
          else if (response && Array.isArray(response.data)) rawList = response.data;
          else if (response && Array.isArray(response.result)) rawList = response.result;
          else if (response && Array.isArray(response.d)) rawList = response.d;
          else if (response && Array.isArray(response.value)) rawList = response.value;
          else if (response && typeof response === 'object' && (Array.isArray(response.Accounts) || Array.isArray(response.Projects))) {
            // backend returned explicit lists
            if (Array.isArray(response.Accounts)) {
              this.AccountList = response.Accounts.map((a: any, idx: number) => ({
                AccountId: a.AccountId ?? a.MastCustId ?? a.accountId ?? null,
                AccountName: a.AccountName ?? a.MastCustName ?? a.accountName ?? `Account ${idx + 1}`,
                raw: a
              }));
            }
            if (Array.isArray(response.Projects)) {
              this.ProjectList = response.Projects.map((p: any, idx: number) => ({
                ProjectId: p.ProjectId ?? p.ProjId ?? p.projectId ?? null,
                ProjectName: p.ProjectName ?? p.ProjName ?? p.projectName ?? `Project ${idx + 1}`,
                AccountId: p.AccountId ?? p.MastCustId ?? p.accountId ?? null,
                AccountName: p.AccountName ?? p.MastCustName ?? null,
                raw: p
              }));
            }
            return;
          }
  
          // if still not an array, try to extract rows object keys
          if (!rawList.length && response && typeof response === 'object') {
            // try common nested keys
            if (Array.isArray(response.rows)) rawList = response.rows;
            else if (Array.isArray(response.items)) rawList = response.items;
          }
  
          // dedupe maps
          const accountsMap = new Map<string | number, any>();
          const projectsMap = new Map<string | number, any>();
  
          (rawList || []).forEach((it: any, idx: number) => {
            // account aliases
            const acctId = it.AccountId ?? it.MastCustId ?? it.accountId ?? it.MastCustID ?? it.CustomerId ?? it.customerId ?? null;
            const acctName = it.AccountName ?? it.MastCustName ?? it.accountName ?? null;
            if (acctId != null || acctName) {
              const key = acctId ?? `name:${acctName}`;
              if (!accountsMap.has(key)) {
                accountsMap.set(key, {
                  AccountId: acctId,
                  AccountName: acctName ?? `Account ${accountsMap.size + 1}`,
                  raw: it
                });
              }
            }
  
            // project aliases (capture account info into project entry)
            const projId = it.ProjectId ?? it.ProjId ?? it.projectId ?? it.ProjID ?? it.ProjectID ?? null;
            const projName = it.ProjectName ?? it.ProjName ?? it.projectName ?? null;
            if (projId != null || projName) {
              const pkey = projId ?? `name:${projName}`;
              if (!projectsMap.has(pkey)) {
                projectsMap.set(pkey, {
                  ProjectId: projId,
                  ProjectName: projName ?? `Project ${projectsMap.size + 1}`,
                  AccountId: acctId ?? it.AccountId ?? it.MastCustId ?? null,     // <-- include owning account id
                  AccountName: acctName ?? it.AccountName ?? it.MastCustName ?? null,
                  raw: it
                });
              }
            }
          });
  
          const accounts = Array.from(accountsMap.values());
          const projects = Array.from(projectsMap.values());
  
          if (accIdForApi === 0) {
            // initial load: set both lists if available
            if (accounts.length) this.AccountList = accounts;
            // set projects even on initial load so user can choose projects without selecting account
            if (projects.length) {
              this.ProjectList = projects;
            } else {
              // fallback: set empty to avoid stale values
              this.ProjectList = [];
            }
          } else {
            // not initial call (account filtered) — update only projects
            this.ProjectList = projects;
          }
        },
        (error: any) => {
          this.toastService.showError(error?.message ?? 'Error fetching lists', 'Error');
        }
      );
    } catch (e) {
      console.error(e);
    }
  }
  
  // ----------------- HELPERS -----------------
  private mapApiToModel(d: any): AlertModel {
    const fmt = (val: any) => {
      if (!val) return '';
    
      // Convert UTC string to local Date
      const localDate = new Date(val);
    
      return this.datePipe.transform(localDate, 'dd/MM/yyyy') ?? '';
    };
    

    const rawAttachments =
      d.attachments ?? d.Attachments ?? d.fileName ?? d.FileName ?? null;

    let normalizedAttachments: { name: string; url?: string | null }[] = [];

    if (Array.isArray(rawAttachments)) {
      normalizedAttachments = rawAttachments.map((a: any) => {
        if (!a) return { name: '' };
        if (typeof a === 'string') return { name: a.trim(), url: null };
        return {
          name: (a.name ?? a.fileName ?? a.FileName ?? String(a)).toString().trim(),
          url: a.url ?? a.Url ?? null
        };
      });
    } else if (typeof rawAttachments === 'string' && rawAttachments.trim().length > 0) {
      const parts = rawAttachments
        .split(/[:;,\|\n]/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      if (parts.length === 1) {
        const fileMatches = Array.from(
          parts[0].matchAll(/[\w\-\s\(\)\[\]\.%]+?\.(?:pdf|docx?|xlsx?|xls|jpg|jpeg|png|txt|csv|zip|rar)/gi)
        ).map(m => m[0].trim());

        if (fileMatches.length > 0) {
          normalizedAttachments = fileMatches.map(name => ({ name, url: null }));
        } else {
          normalizedAttachments = parts.map(p => ({ name: p, url: null }));
        }
      } else {
        normalizedAttachments = parts.map(p => ({ name: p, url: null }));
      }
    } else {
      normalizedAttachments = [];
    }

    const model: AlertModel = {
      EscalationManagementId: d.escalationManagementId ?? d.EscalationManagementId ?? 0,
      ProjectName: d.projectName ?? d.ProjectName ?? '',
      AccountName: d.accountName ?? d.AccountName ?? '',
      Title: d.title ?? d.Title ?? '',
      Description: d.description ?? d.Description ?? '',
      EscalationTypeId: d.escalationTypeId ?? d.EscalationTypeId ?? 0,
      EscalationType: d.escalationType ?? d.EscalationType ?? '',
      EscalationCategoryId: d.escalationCategoryId ?? d.EscalationCategoryId ?? 0,
      EscalationCategory: d.escalationCategory ?? d.EscalationCategory ?? '',
      EscalationPriority: d.escalationPriority ?? d.EscalationPriority ?? 'Low',
      ResponsiblePersonId: d.responsiblePersonId ?? d.ResponsiblePersonId ?? '',
      ResponsiblePerson: d.responsiblePerson ?? d.ResponsiblePerson ?? '',
      DateLogged: fmt(d.dateLogged ?? d.DateLogged),
      TargetResolutionDate: fmt(d.targetResolutionDate ?? d.TargetResolutionDate),
      ActualResolutionDate: fmt(d.actualResolutionDate ?? d.ActualResolutionDate),
      RecordVersion: d.recordVersion ?? d.RecordVersion,
      Attachments: normalizedAttachments,
      Status: d.status ?? d.Status ?? '',
      EscalationDate: fmt(d.escalationDate ?? d.EscalationDate),
      EscalatedBy: d.escalatedBy ?? d.EscalatedBy ?? '',
      EscalationPriorityId: d.escalationPriorityId ?? d.EscalationPriorityId ?? 0,
    };

    (model as any).AccountId = d.accountId ?? d.AccountId ?? null;
    (model as any).ProjectId = d.projectId ?? d.ProjectId ?? null;

    return model;
  }

  trackById(index: number, item: AlertModel): number {
    return item?.EscalationManagementId ?? index;
  }

  // ----------------- MODAL + DELETE FLOW -----------------
  confirmDeletePrompt(item: AlertModel): void {
    this.toDeleteItem = item;

    const modalEl = document.getElementById('deleteConfirmModal');
    if (!modalEl) {
      const ok = window.confirm(`Are you sure you want to delete alert "${item.Title ?? item.EscalationManagementId}"?`);
      if (ok) {
        this.confirmDelete();
      }
      return;
    }

    if (!this.deleteModalInstance) {
      this.deleteModalInstance = new (Modal as any)(modalEl, {
        backdrop: 'static',
        keyboard: false
      });
    }

    try {
      this.deleteModalInstance.show();
    } catch (e) {
      console.warn('Could not show Bootstrap modal, fallback to confirm', e);
      const ok = window.confirm(`Are you sure you want to delete alert "${item.Title ?? item.EscalationManagementId}"?`);
      if (ok) {
        this.confirmDelete();
      }
    }
  }

  cancelDeletePrompt(): void {
    this.toDeleteItem = null;
    if (this.deleteModalInstance) {
      try {
        this.deleteModalInstance.hide();
      } catch (e) {
        const modalEl = document.getElementById('deleteConfirmModal');
        if (modalEl) {
          modalEl.classList.remove('show');
          modalEl.style.display = 'none';
          document.body.classList.remove('modal-open');
        }
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      }
    }
  }

  confirmDelete(): void {
    if (!this.toDeleteItem) return;
    this.isDeleting = true;
    const model: any = {
      IsDelete: true,
      EscalationManagementId: this.toDeleteItem.EscalationManagementId,
      RecordVersion:this.toDeleteItem.RecordVersion,
    };
    const formData = new FormData();
    formData.append('escalationAlert', JSON.stringify(model));

    this.alertModuleService.UpdateAlertDetails(formData).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Deleted successfully', 'Success');
        this.isDeleting = false;
        this.toDeleteItem = null;
        if (this.deleteModalInstance) {
          try {
            this.deleteModalInstance.hide();
          } catch (e) { /* ignore */ }
        }
        this.loadAlerts(this.accounId ?? 0, this.projectId ?? 0);
      },
      error: (err: any) => {
        console.error('Delete failed', err);
        this.isDeleting = false;
        this.toastService.showError('Failed to delete alert', 'Error');
      }
    });
  }

  private escapeHtml(text: any): string {
    if (text == null) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  openExistingFile(filename: string, EscalationManagementId?: number, url?: string): void {
    if (url) {
      window.open(url, '_blank');
      return;
    }
    this.openuploadDocumnet(filename, EscalationManagementId);
  }

  openuploadDocumnet(fileName: any, EscalationManagementId: any) {
    const FileName = fileName;
    const payload  = {
      EscalationManagementId: EscalationManagementId,
      FileName: fileName
    };
    this.alertModuleService.getUploadFIle(payload).subscribe((response: any) => {
      const contentType = this.getContentTypeFromExtension(fileName) ?? 'application/octet-stream';
      const blob = new Blob([response.body], { type: contentType });
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.name = FileName;
      link.title = FileName;
      link.download = FileName;
      link.click();
      link.href = '';
      window.URL.revokeObjectURL(downloadURL);
    });
  }

  getContentTypeFromExtension(fileName: string): string | null {
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
    return (fileName || '').split('.').pop() ?? '';
  }

  // ----------------- CLEANUP -----------------
  ngOnDestroy(): void {
    // unsubscribe search streams
    if (this.searchSubs) this.searchSubs.unsubscribe();

    // DataTable cleanup
    if (this.dtInstance) {
      try {
        this.dtInstance.destroy();
      } catch (e) {
        console.warn('Error destroying DataTable on destroy', e);
      }
      this.dtInstance = null;
    }

    // remove delegated handlers attached to the table
    if (this.table && this.table.nativeElement) {
      const tableElement = $(this.table.nativeElement);
      tableElement.off('click', '.edit-btn');
      tableElement.off('click', '.delete-btn');
      tableElement.off('click', '.attachment-link');
      tableElement.off('click', '.action-toggle');
      tableElement.off('click', '.action-menu');
    }

    // remove document handlers
    $(document).off('click.alert-attachment');
    $(document).off('click.action-menu');

    // dispose modal instance
    if (this.deleteModalInstance) {
      try {
        this.deleteModalInstance.dispose();
      } catch (e) {
        // ignore
      }
      this.deleteModalInstance = null;
    }
  }
  // returns true if either account or project is selected
get isClearEnabled(): boolean {
  return (this.accounId != null) || (this.projectId != null);
}

onAccountClear(): void {
  this.accounId = null;
  this.selectedProjectId = null;
  this.projectId = null;
  if (this.accountControl) this.accountControl.setValue(null, { emitEvent: false });
  if (this.projectControl) this.projectControl.setValue(null, { emitEvent: false });
  this.GetAccountProjectListbyEmpId(null, '');
  this.loadAlerts(0, 0);
}

Clear(): void {
  try {
    this.accounId = null;
    this.projectId = null;
    this.selectedProjectId = null;
    if (this.accountControl) this.accountControl.setValue(null, { emitEvent: false });
    if (this.projectControl) this.projectControl.setValue(null, { emitEvent: false });
    this.GetAccountProjectListbyEmpId(null, '');
    this.loadAlerts(0, 0);
  } catch (err) {
    console.error('Error in Clear():', err);
  }
}
// Clear when Account control is opened
// Clear when Account control is opened — improved to reliably show initial list
onAccountOpen(): void {
  try {
    // Clear local selection state
    this.accounId = null;
    this.projectId = null;
    this.selectedProjectId = null;

    // Clear controls without emitting valueChanges (prevents search loops)
    if (this.accountControl) this.accountControl.setValue(null, { emitEvent: false });
    if (this.projectControl) this.projectControl.setValue(null, { emitEvent: false });

    // Delay the reload slightly so ng-select's open sequence is not interrupted.
    // This ensures the dropdown stays open and shows the initial list.
    setTimeout(() => {
      // Load initial lists (accountId = null -> backend treats as 0)
      this.GetAccountProjectListbyEmpId(null, '');

      // Load alerts for initial (no account/project) state
      this.loadAlerts(0, 0);
    }, 0);
  } catch (err) {
    console.error('Error in onAccountOpen():', err);
  }
}

onAccountClose(): void {

}


// Clear when Project control is opened
onProjectOpen(): void {
  if (this.projectId != null || (this.projectControl && this.projectControl.value != null)) {
    // clear project only (keep account if it already exists)
    this.projectId = null;
    this.selectedProjectId = null;

    if (this.projectControl) this.projectControl.setValue(null, { emitEvent: false });

    // If clearing project should also refresh projects list (and keep account filter), call API:
    const accIdForApi = this.accounId === null || this.accounId === undefined ? 0 : this.accounId;
    this.GetAccountProjectListbyEmpId(this.accounId, '');
    this.loadAlerts(this.accounId ?? 0, 0);
  }
}
downloadAllAttachments(escalationManagementId: number): void {
  const payload = {
    EscalationManagementId: escalationManagementId
  };

  this.alertModuleService.GetDownloadALLDocuments(payload)
    .subscribe({
      next: (response: any) => {
        const blob = new Blob([response.body], {
          type: 'application/zip'
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Documents_${escalationManagementId}.zip`;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        this.toastService.showError('Failed to download attachments', 'Error');
      }
    });
}
openFilterPopup(): void {
  const modalRef = this.modalService.open(AlertFilterComponent, {
    size: 'xl',
    backdrop: 'static',
    keyboard: false,
    windowClass: 'filter-center-modal'
  });

  // 🔥 PASS EXISTING FILTER STATE
  modalRef.componentInstance.appliedFilters = {
    ...this.filters
  };

  modalRef.componentInstance.appliedAccounts =
    this.AccountList.filter(a => this.filters.accountIds.includes(Number(a.AccountId)));

  modalRef.componentInstance.appliedProjects =
    this.ProjectList.filter(p => this.filters.projectIds.includes(Number(p.ProjectId)));

  modalRef.result.then((result) => {
    if (!result) return;

    this.filters = {
      accountIds: result.accounts.map((a: any) => Number(a.AccountId)),
      projectIds: result.projects.map((p: any) => Number(p.ProjectId)),
      alertTypes: result.filters.alertTypes,
      priorities: result.filters.priorities,
      statuses: result.filters.statuses,
      Categories: result.filters.Categories
    };

    this.loadAlertsWithFilters();
  });
}


applyFilterFromTemplate(modal: any): void {
  this.loadAlertsWithFilters();
  modal.close();
}

private loadAlertsWithFilters(): void {
  const payload = {
    accountId: this.filters.accountIds,
    projectId: this.filters.projectIds,
    alertType: this.filters.alertTypes,
    alertPriority: this.filters.priorities,
    alertStatus: this.filters.statuses,
    alertCategory: this.filters.Categories
  };

  this.alertModuleService.getAlertDetails(payload).subscribe({
    next: (data: any[]) => {
      const raw = Array.isArray(data) ? data : [];
      this.alerts = raw.map(d => this.mapApiToModel(d));
      this.filteredAlerts = [...this.alerts];
      this.initOrUpdateDataTable();
    },
    error: err => {
      console.error(err);
      this.toastService.showError('Failed to apply filters', 'Error');
    }
  });
}

}
