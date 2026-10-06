import { Component, Input,AfterViewInit  } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModuleService } from '../alert-module.service';
import { ToastService } from 'src/app/common/toast/toast.service';
interface AccountItem {
  AccountId: number | string | null;
  AccountName: string;
  checked?: boolean;   
  raw?: any;
}

interface ProjectItem {
  ProjectId: number | string | null;
  ProjectName: string;
  AccountId?: number | string | null;
  checked?: boolean;   
  raw?: any;
}
@Component({
  selector: 'app-alert-filter',
  templateUrl: './alert-filter.component.html',
  styleUrls: ['./alert-filter.component.scss']
})

export class AlertFilterComponent implements AfterViewInit{

  constructor(public modal: NgbActiveModal,
    private alertModuleService: AlertModuleService,
    private toastService: ToastService,
  ) {}
  @Input() appliedFilters: any;
@Input() appliedAccounts: any[] = [];
@Input() appliedProjects: any[] = [];
AlertTypeList: any[] = [];
CategoryList: any[] = [];
PriorityList: any[] = [];
StatusList: any[] = [];
isLoadingAccounts = false;
  accountSearchText = '';
  projectSearchText = '';
  indicatorWidth = 0;
  indicatorTransform = 'translateX(0px)';
  currentTabIndex = 0;
  slideClass = 'slide-right';
  AccountList: AccountItem[] = [];
  ProjectList: ProjectItem[] = []; 
  OwnerList: { name: string }[] = [];
  filters = {
    accountIds: [] as number[],
    alertTypes: [] as number[],
    Categories: [] as number[],
    priorities: [] as number[],
    statuses: [] as string[],
    Projectstatus: [] as string[]   // 👈 REQUIRED
  };  
  allProjects: any[] = [];   
  visibleProjects: any[] = []; 
  rawAccountProjectRows: any[] = [];
  selectedAccounts: any[] = [];
  selectedProjects: any[] = [];
  ngOnInit(): void {
    this.GetAccountProjectListbyEmpId(0, '');
    this.GetEscalationType();
    this.GetEscalationCategory();
    this.GetEscalationPriority();
    this.GetEscalationStatus();
    // 🔁 RESTORE FILTER STATE
    if (this.appliedFilters) {
      this.filters = {
        ...this.filters,
        ...this.appliedFilters
      };
    }

  }
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.syncIndicator();
      this.updateProjectsByAccount(); // 🔥 IMPORTANT
    }, 0);
  
    document.addEventListener('shown.bs.tab', (event: any) => {
      const btn = event.target as HTMLElement;
      this.moveIndicator(btn);
    });
  }
  GetEscalationType(){
    try {
      this.isLoadingAccounts = true;
      const IsFilterData = true;
      this.alertModuleService.GetEscalationType(IsFilterData).subscribe((response: any) => {
        this.AlertTypeList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            id: (it.EscalationTypeId ?? it.escalationTypeId ?? null),
            label: (it.Type ?? it.type ?? `Type ${idx + 1}`),
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
      const IsFilterData = true;
      this.alertModuleService.GetEscalationCategory(IsFilterData).subscribe((response: any) => {
        this.CategoryList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            id: (it.EscalationCategoryId ?? it.escalationCategoryId ?? null),
            label: (it.Category ?? it.category ?? `Category ${idx + 1}`),
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
      const IsFilterData = true;
      this.alertModuleService.GetEscalationPriority(IsFilterData).subscribe((response: any) => {
        this.PriorityList = (Array.isArray(response) ? response : (response?.data ?? []))
          .map((it: any, idx: number) => ({
            id: (it.EscalationPriorityId ?? it.escalationPriorityId ?? null),
            label: (it.Priority ?? it.priority ?? `priority ${idx + 1}`),
            raw: it
          }));
      }, (error: any) => {
        this.toastService.showError(error, 'Error');
      });
    } catch (e) {
      this.isLoadingAccounts = false;
    }
  }
  GetEscalationStatus() {
    try {
      this.isLoadingAccounts = true;
  
      this.alertModuleService.GetEscalationStatus(true).subscribe((response: any) => {
  
        const rows: string[] = Array.isArray(response) ? response : response?.data ?? [];
  
        this.StatusList = rows.map((s: string) => ({
          id: s,
          label: s
        }));
  
        console.log('StatusList:', this.StatusList);
  
      }, error => {
        this.toastService.showError(error, 'Error');
      });
  
    } catch (e) {
      this.isLoadingAccounts = false;
    }
  }  
  
  filteredAccounts() {
    const t = (this.accountSearchText || '').toLowerCase();
  
    return this.AccountList.filter(a =>
      (a.AccountName || '').toLowerCase().includes(t)
    );
  }
  

  isAccountSelected(acc: AccountItem): boolean {
    return this.filters.accountIds.includes(Number(acc.AccountId));
  }
  

  toggleAccount(acc: AccountItem) {
    const id = Number(acc.AccountId);
    if (isNaN(id)) return;
  
    if (this.filters.accountIds.includes(id)) {
      this.filters.accountIds = this.filters.accountIds.filter(x => x !== id);
    } else {
      this.filters.accountIds.push(id);
    }
  
    // 🔁 rebuild selectedAccounts from AccountList
    this.selectedAccounts = this.AccountList.filter(a =>
      this.filters.accountIds.includes(Number(a.AccountId))
    );
  
    this.updateProjectsByAccount();
  }
  
  private updateProjectsByAccount(): void {
    if (!this.filters.accountIds.length) {
      this.visibleProjects = [...this.allProjects];
      return;
    }
  
    const accountIds = this.filters.accountIds.map(Number);
  
    this.visibleProjects = this.allProjects.filter(p =>
      accountIds.includes(Number(p.AccountId))
    );
  
    // Remove invalid selected projects
    this.selectedProjects = this.selectedProjects.filter(p =>
      accountIds.includes(Number(p.AccountId))
    );
  }
  
  
  removeAccount(acc: AccountItem) {
    const id = Number(acc.AccountId);
    if (isNaN(id)) return;
  
    this.filters.accountIds = this.filters.accountIds.filter(x => x !== id);
  
    this.selectedAccounts = this.AccountList.filter(a =>
      this.filters.accountIds.includes(Number(a.AccountId))
    );
  
    this.updateProjectsByAccount();
  }
  
  
  

  /* ===============================
     PROJECT METHODS
     =============================== */
     filteredProjects() {
      const t = (this.projectSearchText || '').toLowerCase();
    
      return this.visibleProjects.filter(p =>
        (p.ProjectName || '').toLowerCase().includes(t)
      );
    }    

    isProjectSelected(proj: ProjectItem): boolean {
      return this.selectedProjects.some(
        p => Number(p.ProjectId) === Number(proj.ProjectId)
      );
    }
    

    toggleProject(proj: ProjectItem) {
      const id = Number(proj.ProjectId);
      if (isNaN(id)) return;
    
      const exists = this.selectedProjects.some(p => Number(p.ProjectId) === id);
    
      if (exists) {
        this.selectedProjects = this.selectedProjects.filter(p => Number(p.ProjectId) !== id);
      } else {
        this.selectedProjects.push(proj);
      }
    }
    
  toggleObject(arr: any[], item: any): void {
    const index = arr.indexOf(item);
    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(item);
    }
  }
  
  removeProject(proj: any) {
    this.selectedProjects = this.selectedProjects.filter(p => p !== proj);
  }

  /* ===============================
     GENERIC TOGGLE (ID BASED)
     =============================== */
     toggleItem<T>(arr: T[], id: T): void {
      const index = arr.indexOf(id);
      index > -1 ? arr.splice(index, 1) : arr.push(id);
    }
    

  toggleAlertType(id: number) {
    this.toggleItem(this.filters.alertTypes, id);
  }

  toggleCategory(id: number) {
    this.toggleItem(this.filters.Categories, id);
  }

  togglePriority(id: number) {
    this.toggleItem(this.filters.priorities, id);
  }

  toggleStatus(id: string) {
    this.toggleItem(this.filters.statuses, id);
  }

  /* ===============================
     REMOVE METHODS
     =============================== */
  removeAlertType(id: number) {
    this.filters.alertTypes = this.filters.alertTypes.filter(x => x !== id);
  }

  removeCategory(id: number) {
    this.filters.Categories = this.filters.Categories.filter(x => x !== id);
  }

  removePriority(id: number) {
    this.filters.priorities = this.filters.priorities.filter(x => x !== id);
  }

  removeStatus(id: string) {
    this.filters.statuses = this.filters.statuses.filter(x => x !== id);
  }

  /* ===============================
     LABEL HELPERS
     =============================== */
  getAlertTypeName(id: number) {
    return this.AlertTypeList.find(x => x.id === id)?.label;
  }

  getCategoryName(id: number) {
    return this.CategoryList.find(x => x.id === id)?.label;
  }

  getPriorityName(id: number) {
    return this.PriorityList.find(x => x.id === id)?.label;
  }

  getStatusName(id: string) {
    return this.StatusList.find(x => x.id === id)?.label;
  }

  /* ===============================
     ACTIONS
     =============================== */
     clearAllFilters() {
      this.selectedAccounts = [];
      this.selectedProjects = [];
    
      this.filters = {
        accountIds: [],
        alertTypes: [],
        Categories: [],
        priorities: [],
        statuses: [],
        Projectstatus: []
      };      
      // 🔥 IMPORTANT: RESET PROJECT VISIBILITY
      this.visibleProjects = [...this.allProjects];
      // this.modal.close({
      //   accounts: [],
      //   projects: [],
      //   filters: []
      // });
    }

  applyFilterFromTemplate() {
    this.modal.close({
      accounts: this.selectedAccounts,
      projects: this.selectedProjects,
      filters: this.filters
    });
  }
  onTabChange(nextIndex: number, btn: HTMLElement) {

    // 🔁 SLIDE DIRECTION
    this.slideClass =
      nextIndex > this.currentTabIndex ? 'slide-right' : 'slide-left';
  
    this.currentTabIndex = nextIndex;
  
    // 🎯 PERFECT INDICATOR POSITION
    this.indicatorWidth = btn.offsetWidth;
    this.indicatorTransform = `translateX(${btn.offsetLeft}px)`;
  }
  
  private syncIndicator() {
    const activeBtn = document.querySelector(
      '.custom-tabs .nav-link.active'
    ) as HTMLElement;

    if (activeBtn) {
      this.moveIndicator(activeBtn);
    }
  }

  private moveIndicator(btn: HTMLElement) {
    const tabs = Array.from(
      document.querySelectorAll('.custom-tabs .nav-link')
    ) as HTMLElement[];

    const nextIndex = tabs.indexOf(btn);

    // slide direction
    this.slideClass =
      nextIndex > this.currentTabIndex ? 'slide-right' : 'slide-left';

    this.currentTabIndex = nextIndex;

    // indicator position
    this.indicatorWidth = btn.offsetWidth;
    this.indicatorTransform = `translateX(${btn.offsetLeft}px)`;
  }
  GetAccountProjectListbyEmpId(accountId: number | null, searchText: string = ''): void {
    try {
      const userData = JSON.parse(sessionStorage.getItem('userDetail') || '{}');
      const empEmidsId = userData.EmployeeId;
      const accIdForApi = accountId ?? 0;
  
      this.alertModuleService
        .GetAccountProjectListbyEmpId( accIdForApi, searchText)
        .subscribe({
          next: (response: any) => {
  
            /* ---------------- NORMALIZE RESPONSE ---------------- */
            let rows: any[] = [];
  
            if (Array.isArray(response)) rows = response;
            else if (Array.isArray(response?.data)) rows = response.data;
            else if (Array.isArray(response?.result)) rows = response.result;
            else if (Array.isArray(response?.d)) rows = response.d;
            else if (Array.isArray(response?.value)) rows = response.value;
            else rows = [];
  
            this.rawAccountProjectRows = rows;
  
            /* ---------------- BUILD ACCOUNT LIST (DISTINCT) ---------------- */
            const accountMap = new Map<number, AccountItem>();
  
            rows.forEach(r => {
              const accId = Number(r.accountId ?? r.AccountId);
              if (!accId) return;
  
              if (!accountMap.has(accId)) {
                accountMap.set(accId, {
                  AccountId: accId,
                  AccountName: r.accountName ?? r.AccountName ?? `Account ${accId}`,
                  raw: r
                });
              }
            });
  
            this.AccountList = Array.from(accountMap.values());
            /* ---------------- BUILD PROJECT LIST (ALL) ---------------- */
this.ProjectList = rows.map(r => ({
  ProjectId: Number(r.projectId ?? r.ProjectId),
  ProjectName: r.projectName ?? r.ProjectName ?? '',
  AccountId: Number(r.accountId ?? r.AccountId),
  raw: r
}));

this.allProjects = [...this.ProjectList];

// 🔁 RESTORE SELECTED ACCOUNTS (BY ID)
this.selectedAccounts = this.AccountList.filter(a =>
  this.filters.accountIds.includes(Number(a.AccountId))
);

// 🔁 RESTORE SELECTED PROJECTS (BY ID)
this.selectedProjects = this.ProjectList.filter(p =>
  this.appliedProjects?.some(ap =>
    Number(ap.ProjectId) === Number(p.ProjectId)
  )
);

// 🔥 APPLY ACCOUNT → PROJECT FILTER
this.updateProjectsByAccount();

  
            /* ---------------- BUILD PROJECT LIST (ALL) ---------------- */
            
            // 🔁 RESTORE SELECTED ACCOUNTS (BY ID)

          },
          error: err => {
            console.error(err);
            this.toastService.showError('Error fetching Account / Project list', 'Error');
          }
        });
    } catch (e) {
      console.error('GetAccountProjectListbyEmpId error:', e);
    }
  }  

  
}

