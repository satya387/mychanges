import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RolePopupComponent } from '../role-popup/role-popup.component';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import { OpportunityData } from '../opportunity-rls-expense-model';
import { ToastService } from 'src/app/common/toast/toast.service';
import { ImportRlsComponent } from '../import-rls/import-rls.component';

@Component({
  selector: 'app-rls',
  templateUrl: './rls.component.html',
  styleUrls: ['./rls.component.scss'],
})
export class RlsComponent implements OnInit {
  opportunityData: any;
  rlsDetailsData: any;
  isEditable: boolean = true;
  userAccess: any;
  showDeleteConfirm: boolean = false;
  roleToDelete: any = null;
  isAddDisabled: any;
  UploadedData: any;
  rlsDataOpportunity: any;
  showRolesTable: any;

  constructor(
    private dialog: MatDialog,
    private oppRlsExpService: OpportunityRlsExpenseService,
    private toastService: ToastService
  ) {}

  roles: any[];

  ngOnInit(): void {
    this.oppRlsExpService.userAccessData$.subscribe((data) => {
      this.userAccess = data;
    });
    this.oppRlsExpService.opportunityData$.subscribe((data) => {
      this.opportunityData = data;
    });
    this.oppRlsExpService.rlsData$.subscribe((res: any) => {
      this.rlsDataOpportunity = res?.opportunity;
      this.roles = res?.rLSDetails;
      if(this.roles?.length > 0)
        this.showRolesTable = true;
      else
      this.showRolesTable = false;
      if (
        res?.opportunity?.status == 3 ||
        this.userAccess == 'FP_and_A' ||
        (this.userAccess == 'CP_DP' && res?.opportunity?.status == 2) ||
        (this.userAccess == 'CP_DP' && res?.opportunity?.status == 3)
      ) {
        this.isEditable = false;
      } else this.isEditable = true;
      if (this.userAccess == 'Admin') this.isEditable = true;
      if (res?.opportunity?.status == 7 ||
        res?.opportunity?.status == 6 ||
        res?.opportunity?.status == 5 ||
        res?.opportunity?.status == 3 ||
        res?.opportunity?.status == 2) 
        {
          this.isEditable = false;
      }
      else{
        this.isEditable = true;
      }
      console.log(this.isEditable);
    });
    this.oppRlsExpService.opporitunitySelectedData$.subscribe(
      (data) => (this.isAddDisabled = data)
    );
  }
  addRole(): void {
    const roleNumber = this.roles.length + 1;
    this.roles.push(`Role ${roleNumber}`);
  }

  deleteRole(event: any) {
    this.roleToDelete = event;
    this.showDeleteConfirm = true;
  }
  confirmDelete() {
    if (this.roleToDelete) {
      this.oppRlsExpService
        .deleteRLSDetailsById(this.roleToDelete?.id)
        .subscribe((res) => {
          this.toastService.showSuccess(res.message, 'Success');
          let editOpportunityObject = {
            opportunityId: this.opportunityData.opportunityId,
            id: this.rlsDataOpportunity.id ?? 0
          }
          this.oppRlsExpService
            .getOpportunityAndRLSDetails(editOpportunityObject)
            .subscribe((res: any) => {
              this.oppRlsExpService.setRLSData(res);
              this.oppRlsExpService.setExpenseData(res);
              this.oppRlsExpService.updateOpportunityWiseMarginData(
                res?.opportunityWiseMargin
              );
            });
        });
    }
    this.showDeleteConfirm = false;
    this.roleToDelete = null;
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
    this.roleToDelete = null;
  }
  openUploadDialog(): void {
    if(this.isAddDisabled){
    const dialogConfig = {
      position: { top: '70px' },
      // data: {
      //   UploadedData: this.UploadedData
      // }
      
    };

    // Open the dialog with the specified configuration and pass data
    const dialogRef = this.dialog.open(ImportRlsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  }
  //   this.oppRlsExpService.deleteRLSDetailsById(event?.id).subscribe((res) => {
  //     this.toastService.showSuccess(res.message, 'Success');
  //     this.oppRlsExpService
  //       .getOpportunityAndRLSDetails(this.opportunityData.opportunityId)
  //       .subscribe((res: any) => {
  //         this.oppRlsExpService.setRLSData(res);
  //         this.oppRlsExpService.updateOpportunityWiseMarginData(
  //           res?.opportunityWiseMargin
  //         );
  //       });
  //   });
  // }

  openRolePopup(role?: any): void {
    if (role) {
      this.oppRlsExpService
        .getRlsAndRLSAllocationDetails(role.id)
        .subscribe((res: any) => {
          this.rlsDetailsData = res;
          if (this.opportunityData.name) {
            this.dialog.open(RolePopupComponent, {
              width: '95vw',
              data: { rlsDetailsData: this.rlsDetailsData },
              maxWidth: '95vw',
              maxHeight: '90vh',
              panelClass: 'role-popup-container',
            });
          }
        });
    } else {
      if (this.isAddDisabled) {
        this.dialog.open(RolePopupComponent, {
          width: '95vw',
          data: { rlsDetailsData: null },
          maxWidth: '95vw',
          maxHeight: '90vh',
          panelClass: 'role-popup-container',
        });
      }
    }
  }
}
