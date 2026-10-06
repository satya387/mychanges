import { Component, OnInit } from '@angular/core';
import { IronCladService } from './iron-clad.service';
import { IronCladContractDetails } from './iron-clad.model';
import { Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertModuleService } from 'src/app/alert-module/alert-module.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Console } from 'console';

@Component({
  selector: 'app-iron-clad-dashboard',
  templateUrl: './iron-clad-dashboard.component.html',
  styleUrls: ['./iron-clad-dashboard.component.scss']
})

export class IronCladDashboardComponent implements OnInit {
  records: import('./iron-clad.model').IronCladContractDetails[] = [];
  loading = false;
  error = '';
  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;
  searchText = '';
  @Input() data: IronCladContractDetails | null = null;
  isEditMode = false;
  selectedItem: IronCladContractDetails | null = null;
  form!: FormGroup;
  selectedData: IronCladContractDetails;
  entityList: any[] = [];
  accountList: any[] = [];
  projectList: any[] = [];
  activeMenuId: number | null = null;
  showDeleteModal = false;
  AccessTypeId: any;
  selectedStage = 'All';
  selectedDocumentId: number | null = null;
  constructor(
    private alertService: AlertModuleService,
    private route: ActivatedRoute,
    private ironCladService: IronCladService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService) { }


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      const documentId = params['documentId'];
      const stage = params['stage'];

      this.selectedStage = stage || 'All';
      this.selectedDocumentId =
        documentId
          ? Number(documentId)
          : null;

      this.pageNumber = 1;

      if (this.selectedDocumentId) {
        this.loadListByDocument(this.selectedDocumentId);
      } else {
        this.loadList();
      }
    });

    window.addEventListener('ironclad:added', this._onAdded);

    this.initializeForm();
    this.loadEntities();
    this.loadAccounts();
    this.LoadAccessType();
  }



  getEntityName(id: number) {
    return this.entityList.find(x => x.id === id)?.name || id;
  }

  loadListByDocument(documentId: number): void {
    this.loading = true;
    this.error = '';
    this.ironCladService
      .getList(
        this.pageNumber,
        this.pageSize,
        this.searchText,
        this.selectedStage
      )
      .subscribe({
        next: (res: any[]) => {
          const data = res || []
          

          this.records = data.filter((item: any) => {
            const docId =
              item.documentId ??
              item.DocumentId ??
              item.documentID ??
              item.document_id;

            return Number(docId) === Number(documentId);
          });
            this.totalRecords = this.records.length > 0
          ? this.records[0].totalCount
          : 0;
          this.loadProjectNames();

         

          this.loading = false;
        },

        error: (err) => {

          console.error(
            'GetIronCladList By Document Error:',
            err
          );

          this.error = 'Failed to load filtered records';
          this.loading = false;
        }
      });
  }


  toggleMenu(id: number) {
    this.activeMenuId = this.activeMenuId === id ? null : id;
  }


  getAccountName(id: number) {
    return (
      this.accountList.find(x => x.accountId === id || x.id === id)?.accountName ||
      this.accountList.find(x => x.id === id)?.name ||
      id
    );
  }

  getProjectName(id: number) {
    return (
      this.projectList.find(x => x.projectId === id || x.id === id)?.projectName ||
      this.projectList.find(x => x.id === id)?.name ||
      id
    );
  }



  loadEntities() {
    this.ironCladService.getEntityList().subscribe(res => {
      this.entityList = res;

    });

  }
  getProjectList(accountId: number): void {
    this.alertService.GetProjectbyEmpId(accountId).subscribe({
      next: (response: any) => {
        console.log(response);
        this.projectList = response;
      },

      error: (error) => {
        console.error(error);
      }

    });

  }


  loadAccounts() {
    this.alertService.GetAccountListbyEmpId().subscribe((res: any[]) => {
      this.accountList = res;

      if (res && res.length > 0) {
        const accountId = res[0].accountId || res[0].id;
        this.getProjectList(accountId);
      }
    });
  }

  initializeForm() {
    this.form = this.fb.group({
      id: [''],
      dateOfAggrement: [''],
      startDate: [''],
      endDate: ['']

    });

  }

  // EDIT FUNCTION
  onEdit(id: number) {
    this.isEditMode = true;
    this.ironCladService.getById(id).subscribe((res: any) => {
      const fixedData = {
        ...res,
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

      this.selectedData = {
        ...fixedData,
        fileList: res.fileList || []
      };

      this.form.patchValue(fixedData);
    });
  }

  openDelete(item: IronCladContractDetails) {
    this.selectedItem = item;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.selectedItem = null;
  }

  canShowDelete(item: any): boolean {
  const restrictedStages = [
    'review',
    'completed',
    'approved for signing'
  ];

  const currentStage = (item?.contractStatusName || item?.ContractStatusName || '').trim().toLowerCase();

  return !restrictedStages.includes(currentStage);
}
  confirmDelete() {

    if (!this.selectedItem) {
      return;
    }

    const id =
      this.selectedItem.contractId ??
      this.selectedItem.ContractId ??
      this.selectedItem.id ??
      this.selectedItem.Id;
    console.log('Deleting ContractId =>', id);
    if (!id) {
      this.toastr.error('Invalid Contract Id', 'Error');
      return;
    }

    this.ironCladService.delete(id).subscribe({
      next: (res: any) => {
        console.log('Delete Success =>', res);

        this.toastr.success(
          res?.message || 'Contract deleted successfully',
          'Success'
        );

        this.showDeleteModal = false;
        this.selectedItem = null;
        this.activeMenuId = null;

        if (this.selectedDocumentId) {
          this.loadListByDocument(this.selectedDocumentId);
        } else {
          this.loadList();
        }
      },

      error: (err) => {
        console.error('Delete Error =>', err);
        this.toastr.error(
          err?.error?.message || 'Failed to delete contract',
          'Error'
        );
      }
    });
  }

  private _onAdded = (e: any) => {

    if (this.selectedDocumentId) {
      this.loadListByDocument(this.selectedDocumentId);
    } else {
      this.loadList();
    }
  }


  AddContractPage(data?: IronCladContractDetails): void {

    this.selectedData = data || null;
    this.router.navigate(
      ['/Customer-Contract-Review/add-contract-management-documents'],
      {
        state: { selectedData: this.selectedData }
      }
    );
  }


  private loadProjectNames(): void {
    const accountIds = [
      ...new Set(
        this.records
          .filter(x => x.accountId)
          .map(x => x.accountId)
      )
    ];

    accountIds.forEach(accountId => {

      this.alertService
        .GetProjectbyEmpId(accountId)
        .subscribe((projects: any[]) => {

          this.records
            .filter(x => x.accountId === accountId)
            .forEach(record => {

              const project = projects.find(
                (p: any) =>
                  Number(p.projectId) === Number(record.projectId)
              );

              if (project) {
                record.projectName =
                  project.projectName;
              }
            });
        });
    });
  }


 loadList(): void {
  this.loading = true;
  this.error = '';
 
  this.ironCladService
    .getList(
      this.pageNumber,
      this.pageSize,
      this.searchText,
      this.selectedStage
    )
    .subscribe({
      next: (data: any[]) => {
        this.records = data || [];
        this.totalRecords = this.records.length > 0
          ? this.records[0].totalCount
          : 0;
 
        this.loadProjectNames();
        this.loading = false;
      },
      error: (err) => {
        console.error('GetIronCladList Error:', err);
        this.error = 'Failed to load records';
        this.loading = false;
      }
    });
}

  goToDetails(item: any) {
    const contractId = item.contractId || item.ContractId;
    this.router.navigate(
      ['/Customer-Contract-Review/Contract-Details', contractId]
    );
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      if (this.selectedDocumentId) {
        this.loadListByDocument(this.selectedDocumentId);
      } else {
        this.loadList();
      }
    }
  }

  nextPage(): void {

    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      if (this.selectedDocumentId) {
        this.loadListByDocument(this.selectedDocumentId);
      } else {
        this.loadList();
      }
    }
  }


  onSearch(): void {
    this.pageNumber = 1;
     const searchValue = (this.searchText || '').trim();
      const validCharacters = searchValue.replace(/[^a-zA-Z0-9]/g, '');
    if (this.selectedDocumentId) {
       if (validCharacters.length >= 3 || searchValue.length === 0) {
      this.loadListByDocument(this.selectedDocumentId);
    }
    } else {
      this.loadList();
    }
  }
  get totalPages(): number {
    return Math.ceil(
      this.totalRecords / this.pageSize
    );
  }

  clearSearch(): void {
    this.searchText = '';
    this.pageNumber = 1;
    if (this.selectedDocumentId) {
      this.loadListByDocument(this.selectedDocumentId);
    } else {
      this.loadList();
    }
  }

  LoadAccessType() {
    this.ironCladService.GetAccessTypebyEmpId().subscribe((res: any) => {
      this.AccessTypeId = res;
    })
  }
}

