import { Component, OnInit } from '@angular/core';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { Observable, Observer } from 'rxjs';
import { settings } from 'src/app/common/configuration.settings';
import { MatDialog } from '@angular/material/dialog';
import { ApproveRejectOpportunityModalComponent } from '../approve-reject-opportunity-modal/approve-reject-opportunity-modal.component';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PlanActualComponent } from '../plan-actual/plan-actual.component';


@Component({
  selector: 'app-opportunity-landing-page',
  templateUrl: './opportunity-landing-page.component.html',
  styleUrls: ['./opportunity-landing-page.component.scss'],
})
export class OpportunityLandingPageComponent implements OnInit {
  opportunities: any;
  selectedTabIndex: number = 0;
  asyncTabs: Observable<any[]>;
  limit: any = 8;
  page: any = 1;
  totalRecord: any = 8;
  offset: any = settings.offset;
  filteredOpportunities: any[] = [];
  userAccess: any;
  preFilteredOpportunities: any;
  htmlContent: SafeHtml;
  submittedStatuses = [2, 5, 6, 7];
  searchOpportunityId: string = '';
allOpportunityIds: string[] = [];
filteredOpportunityIds: string[] = [];
isSearchMode: boolean = false;
isProgrammaticTabChange: boolean = false;
//here I need when status = 2 I need Show Pending BU Approval for status = 5 Pending DH Approval for status=6  Pending CDO Approval for status = 7 Pending CFO Approval


  constructor(
    private oppRlsExpService: OpportunityRlsExpenseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar, 
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    // this.asyncTabs = new Observable((observer: Observer<any[]>) => {
    //   setTimeout(() => {
    //     observer.next([
    //       { label: 'DRAFT', Value: 1 },
    //       { label: 'SUBMITTED', Value: 2 },
    //       { label: 'APPROVED', Value: 3 },
    //       { label: 'REJECTED', Value: 4 },
    //     ]);
    //   }, 1000);
    // });
  }

  // ngOnInit(): void {
  //   this.selectedTabIndex = 0;
  //   this.oppRlsExpService.userAccessData$.subscribe((data) => {
  //     this.userAccess = data;
  //   });

  //   //  this.oppRlsExpService.getRLSAccessByEmpemidsId().subscribe(res=> this.userAccess = res?.accessType);
  //   this.oppRlsExpService.getOpportunityDashboardGrid().subscribe((data) => {
  //     this.opportunities = data;
  //     this.filteredOpportunities =
  //       this.opportunities?.opportunityDashboardGrid?.filter(
  //         (opportunity: any) => {
  //           this.asyncTabs = new Observable((observer: Observer<any[]>) => {
  //             setTimeout(() => {
  //               const tabs = [
  //                 { label: 'DRAFT', Value: 1 },
  //                 { label: 'SUBMITTED', Value: 2 },
  //                 { label: 'APPROVED', Value: 3 },
  //                 { label: 'REJECTED', Value: 4 },
  //               ];

  //               if (this.userAccess === 'FP_and_A') {
  //                 // this.selectedTabIndex = 1;
  //                 observer.next(tabs.filter(tab => tab.label !== 'DRAFT'));
  //               } else {
  //                 observer.next(tabs); // Show all tabs otherwise
  //               }
  //             }, 1000);
  //           });

  //           // console.log(this.userAccess);
  //           // if (this.userAccess === 'FP_and_A')
  //           //   this.selectedTabIndex += 1 ;
  //           // console.log('selected tab ',this.selectedTabIndex);
  //           return opportunity.status === this.selectedTabIndex + 1;
  //         }
  //       );
  //     this.totalRecord = this.filteredOpportunities?.length;
  //   });
  // }

  ngOnInit(): void {
    this.selectedTabIndex = 0;
    this.oppRlsExpService.userAccessData$.subscribe((data) => {
      this.userAccess = data;

    this.oppRlsExpService.getOpportunityDashboardGrid().subscribe((data) => {
      if (data?.opportunityDashboardGrid?.length > 0) {
        this.opportunities = data.opportunityDashboardGrid.map((item) => {
          return {
            ...item,
            revenue: (item.revenue / 1000000).toFixed(2).toString(),
            expense: (item.expense / 1000000).toFixed(2).toString(),
            margin: (item.margin / 1000000).toFixed(2).toString(),
            discountAmount: (item.discountAmount / 1000000).toFixed(2).toString(),
          };
        });

        // Grouping opportunities by `opportunityId`
        const opportunityMap = new Map();
        this.opportunities.forEach((opportunity) => {
          const { opportunityId } = opportunity;
          if (!opportunityMap.has(opportunityId)) {
            opportunityMap.set(opportunityId, []);
          }
          opportunityMap.get(opportunityId).push(opportunity);
        });

        // Apply the status rules to the grouped opportunities
        this.preFilteredOpportunities = Array.from(opportunityMap.values())
          .map((opportunities) => {
            if (opportunities.length > 1) {
              if (this.userAccess === 'FP_and_A') {
                if (opportunities.every((op) => op.status === 1)) {
                  return opportunities;
                } else if (
                  opportunities.some((op) => this.submittedStatuses.includes(op.status) || op.status === 3)
                ) {
                  return [
                    opportunities.find(
                      (op) => this.submittedStatuses.includes(op.status) || op.status === 3
                    ),
                  ];
                } else if (opportunities.some((op) => op.status === 4)) {
                  return opportunities.map((op) => ({
                    ...op,
                    status: op.status === 4 ? 4 : 1,
                  }));
                }
              } else {
                if (opportunities.every((op) => op.status === 1)) {
                  return opportunities;
                } else if (
                  opportunities.some((op) => this.submittedStatuses.includes(op.status) || op.status === 3)
                ) {
                  return [
                    opportunities.find(
                      (op) => this.submittedStatuses.includes(op.status) || op.status === 3
                    ),
                  ];
                } else if (opportunities.some((op) => op.status === 4)) {
                  return opportunities.map((op) => ({ ...op, status: 4 }));
                }
              }
            }
            return opportunities; // Default case
          })
          .flat(); // Flatten into a single array
  
        if(this.userAccess != 'FP_and_A'){
          const allStatuses = [1, 2, 3, 4, 5, 6, 7];

          allStatuses.forEach(status => {
            this.filterOpportunitiesTabWise(status);
          });
          

      }

              // Get unique opportunity IDs
              this.allOpportunityIds = Array.from(
                new Set(this.preFilteredOpportunities.map((o: any) => String(o.opportunityId)))
              );
              this.searchOpportunityId = null;
              this.filteredOpportunityIds = [...this.allOpportunityIds];
this.filteredOpportunityIds = [...this.allOpportunityIds];
        // Filter opportunities based on the selected tab index
        this.filteredOpportunities = this.preFilteredOpportunities.filter(
          (opportunity: any) => {
            this.asyncTabs = new Observable((observer: Observer<any[]>) => {
              setTimeout(() => {
                const tabs = [
                  { label: 'DRAFT', Value: 1 },
                  { label: 'SUBMITTED', Value: 2 },
                  { label: 'APPROVED', Value: 3 },
                  { label: 'REJECTED', Value: 4 },
                ];

                if (this.userAccess === 'FP_and_A') {
                  observer.next(tabs.filter((tab) => tab.label !== 'DRAFT'));
                } else {
                  observer.next(tabs); // Show all tabs otherwise
                }
              }, 1000);
            });
            return opportunity.status === this.selectedTabIndex + 1;
          }
        );

        this.totalRecord = this.filteredOpportunities?.length;
      } else {
        this.asyncTabs = new Observable((observer: Observer<any[]>) => {
          setTimeout(() => {
            const tabs = [
              { label: 'DRAFT', Value: 1 },
              { label: 'SUBMITTED', Value: 2 },
              { label: 'APPROVED', Value: 3 },
              { label: 'REJECTED', Value: 4 },
            ];

            if (this.userAccess === 'FP_and_A') {
              observer.next(tabs.filter((tab) => tab.label !== 'DRAFT'));
            } else {
              observer.next(tabs); // Show all tabs otherwise
            }
          }, 1000);
        });
      }
    });
  });

  }

  filterOpportunitiesTabWise(status: number){
    const records = this.preFilteredOpportunities.filter((x) => x.status === status);

    let batchStart = 0; // Start index of the current batch
    let currentBatch: Record<string, { count: number; firstIndex: number }> = {};

    // Iterate over the records
    for (let i = 0; i < records.length; i++) {
      const { opportunityId } = records[i];

      // Initialize or update the current batch tracking for the opportunityId
      if (!currentBatch[opportunityId]) {
        currentBatch[opportunityId] = { count: 0, firstIndex: i };
      }
      currentBatch[opportunityId].count++;

      // If the batch ends or it’s the last record, update rowSpan and isFirstRow
      if ((i + 1) % this.limit === 0 || i === records.length - 1) {
        for (let j = batchStart; j <= i; j++) {
          const { opportunityId } = records[j];
          records[j].rowSpan = currentBatch[opportunityId].count;
          records[j].isFirstRow = j === currentBatch[opportunityId].firstIndex;
        }

        // Reset batch tracking for the next batch
        batchStart = i + 1;
        currentBatch = {};
      }
    }

    // Update preFilteredOpportunities with the modified records
    this.preFilteredOpportunities = this.preFilteredOpportunities.map((opportunity) => {
      const draftRecord = records.find((record) => record === opportunity);
      return draftRecord || opportunity;
    });
  }

  addNew() {
    this.oppRlsExpService.updategoToCreatePageValue(true);
    this.oppRlsExpService.filterOpportunities(this.opportunities);
  }

  graphDashboard() {
    this.oppRlsExpService.setisGraphDashboardUpValue(true);
  }
  timeline(event:any) {
    console.log('event:',event)
    this.router.navigate(['timeline'], {
      queryParams: {
        id: event.id
      }
    });
  }

  navigateToCreatedProjects() {
    this.router.navigate(['download-rls']);
  }

  navigateToPlanActual() {
    this.router.navigate(['plan-actual']);
  }

  onSelectStatus(field, event) {
    this.selectedTabIndex = event.index;
    const tabIndex = event.index;
    this.page = 1;
    if (this.isProgrammaticTabChange) {
      this.isProgrammaticTabChange = false;
      return;
    }

    if (this.isSearchMode) {
      this.isSearchMode = false;
      this.searchOpportunityId = null;
      this.filteredOpportunityIds = [...this.allOpportunityIds];
    }
    let statuses: number[] = [];
  
    if (this.userAccess === 'FP_and_A') {
      // FP_and_A does not see DRAFT
      switch (tabIndex) {
        case 0: 
          statuses = this.submittedStatuses;
          break;
        case 1: 
          statuses = [3];
          break;
        case 2: 
          statuses = [4];
          break;
        default:
          statuses = [];
      }
    } else {
      switch (tabIndex) {
        case 0: // DRAFT
          statuses = [1];
          break;
        case 1: // SUBMITTED
          statuses = this.submittedStatuses;
          break;
        case 2: // APPROVED
          statuses = [3];
          break;
        case 3: // REJECTED
          statuses = [4];
          break;
        default:
          statuses = [];
      }
    }
  
    this.filteredOpportunities = this.preFilteredOpportunities.filter(
      (op: any) => statuses.includes(op.status)
    );
  
    this.totalRecord = this.filteredOpportunities.length;


  }
  

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
    let searchValue = 0;
    // this.isPageChanged = this.page === 1 ? false : true;
    if (this.selectedTabIndex == 0 || this.selectedTabIndex == 1) {
      searchValue = this.selectedTabIndex + 1;
    } else if (event.index == 2) searchValue = 8;
    // this.configureRequest('Status', 'asc', searchValue);
  }

  editOpportunity(event: any) {
    this.oppRlsExpService.updateEditOpportunityData(event);
    this.oppRlsExpService.updategoToCreatePageValue(true);
  }

  approveOpportunity(event: any, action: string) {
    const dialogRef = this.dialog.open(ApproveRejectOpportunityModalComponent, {
      panelClass: 'approve-reject',
      width: '400px',
      data: { opportunity: action },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let approveRejectObject = {
          id: event.id,
          comments: result || null,
          isApprove: true,
        };
        this.oppRlsExpService
          .approveRejectOpportunity(approveRejectObject)
          .subscribe(
            (response) => {
              this.ngOnInit();
            },
            (error) => console.error('Error:', error)
          );
      }
    });
  }

  rejectOpportunity(event: any, action: string) {
    const dialogRef = this.dialog.open(ApproveRejectOpportunityModalComponent, {
      width: '400px',
      data: { opportunity: action },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let approveRejectObject = {
          id: event.id,
          comments: result,
          isReject: true,
        };
        this.oppRlsExpService
          .approveRejectOpportunity(approveRejectObject)
          .subscribe(
            (response) => {
              this.ngOnInit();
            },
            (error) => console.error('Error:', error)
          );
      }
    });
  }

  saveAsCopy(event: any) {
    let copyOpportunityDataObject = {
      opportunityId: event.opportunityId,
      id: event.id,
      empEmidsId: '',
    };
    this.oppRlsExpService
      .copyOpportunityData(copyOpportunityDataObject)
      .subscribe((data: any) => {
        this.snackBar.open(
          `Created ${event.opportunityName}_${data.data.versionName}`,
          'Close',
          {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          }
        );
        this.ngOnInit();
      });
  }

  DownloadReports(opportunity: any) {
    const object = {
      OpportunityId: opportunity.id,
      OppId: opportunity.opportunityId
    };
    this.DownloadPLandViewReport(object);
  }

  DownloadPLandViewReport(object) {
    this.oppRlsExpService.downloadPLViewReport(object).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200 || data.status === 202) {
          console.log(`Got a successfull status code: ${data.status}`);
          const blob = new Blob([data.body], {
            type: 'application/vnd.ms-excel',
          });
          var downloadURL = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = object.OppId+'_PL_View_Report.xls';
          link.click();
          link.href = '';
          window.URL.revokeObjectURL(downloadURL);
          console.log(`This contains body: ${data.body}`);
          this.DownloadFTEUtilizationReport(object);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(`Got a error status code: ${err.status}`);
        if (err.status === 403) {
          console.error('403 status code caught');
        }
      }
    );
  }

  DownloadFTEUtilizationReport(object) {
    this.oppRlsExpService.downloadFTEUtilizationReport(object).subscribe(
      (data: HttpResponse<any>) => {
        if (data.status === 200 || data.status === 202) {
          console.log(`Got a successfull status code: ${data.status}`);
          const blob = new Blob([data.body], {
            type: 'application/vnd.ms-excel',
          });
          var downloadURL = window.URL.createObjectURL(blob);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = object.OppId+'_FTE_Utilization_Report.xls';
          link.click();
          link.href = '';
          window.URL.revokeObjectURL(downloadURL);
          console.log(`This contains body: ${data.body}`);
        }
      },
      (err: HttpErrorResponse) => {
        console.log(`Got a error status code: ${err.status}`);
        if (err.status === 403) {
          console.error('403 status code caught');
        }
      }
    );
  }

  GetPLandViewHtmlReport(opportunityId) {
    this.oppRlsExpService.getPLViewHtmlReport(opportunityId).subscribe((res: any) => {
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(res.data);
          // Open a new tab
          const newTab = window.open('', '_blank');
          if (newTab) {
            newTab.document.write(this.htmlContent.toString().replace('SafeValue must use [property]=binding:','')
                                                              .replace('(see https://g.co/ng/security#xss)',''));
          }
          newTab.document.close();
        },
        (err: HttpErrorResponse) => {
          console.log(`Got a error status code: ${err.status}`);
          if (err.status === 403) {
            console.error('403 status code caught');
          }
        }
      )
  }

  openPlanVsActualPopup(): void {
    this.dialog.open(PlanActualComponent, {
      width: 'auto',             // Fixed width
      height: 'auto',
      maxHeight: '90vh',
      panelClass: 'planVsActual-popup-container',
      autoFocus: false,           // optional, prevents auto-focus jump
      disableClose: false
    });
  }
  getPendingStatusLabel(status: number): string {
    switch (status) {
      case 2:
        return 'Pending BU Approval';
      case 5:
        return 'Pending DH Approval';
      case 6:
        return 'Pending CDO Approval';
      case 7:
        return 'Pending BFM Approval';
      default:
        return '-';
    }
  }
  isSubmittedTab(): boolean {
    return this.selectedTabIndex === (this.userAccess === 'FP_and_A' ? 0 : 1);
  }
 
  DownloadTemplate() {
    var fileName = 'RLS V2.2.5.xlsx';
    var folderName = 'Template';
    
    const object = {
      FileName: fileName,
      FolderName: folderName
    }
    this.oppRlsExpService.getUploadFile(object).subscribe((response: any) => {
      const contentType = this.getContentTypeFromExtension(fileName);
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
  onSearchChange() {
    const value = this.searchOpportunityId?.toLowerCase() || '';
  
    this.filteredOpportunityIds = this.allOpportunityIds.filter(id =>
      id.toLowerCase().includes(value)
    );
  }
  onSelectOpportunity(opportunityId: string) {

    if (!opportunityId) {
      this.clearSearch();
      return;
    }
  
    this.isSearchMode = true;
    this.isProgrammaticTabChange = true; // 👈 VERY IMPORTANT
  
    const selectedOpportunity = this.preFilteredOpportunities.find(
      (op: any) => op.opportunityId === opportunityId
    );
  
    if (!selectedOpportunity) return;
  
    const tabIndex = this.getTabIndexForStatus(selectedOpportunity.status);
  
    this.selectedTabIndex = tabIndex;
  
    let statuses: number[] = [];
  
    if (this.userAccess === 'FP_and_A') {
      switch (tabIndex) {
        case 0: statuses = this.submittedStatuses; break;
        case 1: statuses = [3]; break;
        case 2: statuses = [4]; break;
      }
    } else {
      switch (tabIndex) {
        case 0: statuses = [1]; break;
        case 1: statuses = this.submittedStatuses; break;
        case 2: statuses = [3]; break;
        case 3: statuses = [4]; break;
      }
    }
  
    this.filteredOpportunities = this.preFilteredOpportunities.filter(
      (op: any) =>
        op.opportunityId === opportunityId &&
        statuses.includes(op.status)
    );
  
    this.totalRecord = this.filteredOpportunities.length;
    this.page = 1;
  }
  clearSearch() {
    this.searchOpportunityId = null;
this.filteredOpportunityIds = [...this.allOpportunityIds];
    this.isSearchMode = false;  
    this.onSelectStatus('Status', { index: this.selectedTabIndex });
  }
  getTabIndexForStatus(status: number): number {
    if (this.userAccess === 'FP_and_A') {
      if (this.submittedStatuses.includes(status)) return 0;
      if (status === 3) return 1;
      if (status === 4) return 2;
    } else {
      if (status === 1) return 0;
      if (this.submittedStatuses.includes(status)) return 1;
      if (status === 3) return 2;
      if (status === 4) return 3;
    }
    return 0;
  }
  onTabClick() {

    // If user clicks tab while search active
    if (this.isSearchMode) {
      this.isSearchMode = false;
      this.searchOpportunityId = null;
this.filteredOpportunityIds = [...this.allOpportunityIds];
  
      // reload current tab data fully
      let statuses: number[] = [];
  
      if (this.userAccess === 'FP_and_A') {
        switch (this.selectedTabIndex) {
          case 0: statuses = this.submittedStatuses; break;
          case 1: statuses = [3]; break;
          case 2: statuses = [4]; break;
        }
      } else {
        switch (this.selectedTabIndex) {
          case 0: statuses = [1]; break;
          case 1: statuses = this.submittedStatuses; break;
          case 2: statuses = [3]; break;
          case 3: statuses = [4]; break;
        }
      }
  
      this.filteredOpportunities = this.preFilteredOpportunities.filter(
        (op: any) => statuses.includes(op.status)
      );
  
      this.totalRecord = this.filteredOpportunities.length;
    }
  }

  openuploadDocumnet(data) {
    var fileName = data.opportunityId+'_'+data.versionNumber+'.xlsx';
    var folderName = data.opportunityId;
    
    const object = {
      FileName: fileName,
      FolderName: folderName
    }
    this.oppRlsExpService.getUploadFile(object).subscribe((response: any) => {
      const contentType = this.getContentTypeFromExtension(fileName);
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
}
