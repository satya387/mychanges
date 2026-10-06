import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
import {
  IdValue,
  OpportunityData,
  ResourceDetail,
  RLSInputBindingModel,
} from '../opportunity-rls-expense-model';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-role-popup',
  templateUrl: './role-popup.component.html',
  styleUrls: ['./role-popup.component.scss'],
})
export class RolePopupComponent implements OnInit {
  roleForm: FormGroup;
  resourceCounts: FormGroup;
  allSFLocations: IdValue[];
  selectedLocation: IdValue = null;
  allSFRoles: IdValue[];
  selectedRole: IdValue = null;
  allSFTechnologies: IdValue[];
  selectedTechnology: IdValue = null;
  allSFExperience: IdValue[];
  filteredSFTechnologies: IdValue[];
  selectedExperience: IdValue = null;
  selectedShift: string = '';
  deviationInRatePercent: number = 0;
  deviationInCostPercent: number = 0;
  shiftAllowanceBillRate: number = 0;
  shiftAllowanceCost: number = 0;
  eff_HourlyRate: number = 0;
  eff_MonthlyRateWithAllowance: number = 0;
  eff_HourlylyCost: number = 0;
  eff_MonthlyCostWithAllowance: number = 0;
  marginValue: number = 0;
  standardBillRate: number = 0;
  proposedBillRate: number = 0;
  standardCost: number = 0;
  proposedCost: number = 0;
  resourceCode: string = '';
  opportunityData: OpportunityData;
  resourceDetails: ResourceDetail[] = [];
  rlsDetailsData: any;
  isAddButtonClicked = false;
  minEndDate: string = '';
  isResourceNotYetAssigned: boolean = false;
  temporaryStandardBillRate: number = 0;
  temporaryProposedBillRate: number = 0;
  temporaryShiftAllowanceBillRate: number = 0;
  currencySymbol: string = '$';
  resourcesAvailable: boolean = false;
  apiToBeCalled: string;
  currencyLabel: string = 'Standard Cost ($)';
  locationDropdown: any;
  roleDropdown: any;
  primarySkillDropdown: any;
  secondarySkillDropdown: any;
  experienceDropdown: any;
  formattedProjectStart: any;
  formattedProjectEnd: any;
  isSubmitDisabled: boolean = false;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private oppRlsExpService: OpportunityRlsExpenseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rlsDetailsData = data.rlsDetailsData;
  }

  ngOnInit(): void {
    this.roleForm = this.fb.group({
      resourceId: [''],
      resourceName: [''],
      resource: ['', Validators.required],
      role: ['', Validators.required],
      primarySkill: ['', Validators.required],
      secondarySkill: [''],
      experience: ['', Validators.required],
      location: ['', Validators.required],
      hire: ['', Validators.required],
      resourceType: ['', Validators.required],
      workSlot: ['', Validators.required],
      phase: ['', Validators.required],
      tracks: ['', Validators.required],
      serviceArea: ['', Validators.required],
      standardBillRate: [0],
      proposedBillRate: [0],
      rateDeviation: [0],
      shiftAllowanceBillRate: [0],
      eff_HourlyRate: [0],
      eff_MonthlyRateWithAllowance: [0],
      standardCost: [0],
      proposedCost: [0],
      costDeviation: [0],
      shiftAllowanceCost: [0],
      eff_HourlylyCost: [0],
      eff_MonthlyCostWithAllowance: [0],
      margin: [0],
      resourceCode: [''],
      remarks: [''],
      roleStartDate: ['', Validators.required],
      roleEndDate: ['', Validators.required],
      id: [0],
    });
    this.resourceCounts = this.fb.group({});
    
    this.oppRlsExpService.opportunityData$.subscribe((data) => {
      this.opportunityData = data;
      this.updateDateRange();
    });
    this.oppRlsExpService.rlsData$.subscribe((data) => {
      if (this.opportunityData) this.opportunityData.id = data?.opportunity?.id ?? 0;
    });

    this.oppRlsExpService.getAllSFLocation().subscribe((res: any) => {
      this.allSFLocations = res;
      if (this.rlsDetailsData) {
        this.populateFormWithRLSDetailsData();
      }
      this.isEdit = true;
    });

    

    this.roleForm.get('primarySkill')?.valueChanges.subscribe((value) => {
      this.onPrimaryorSecondaryChange();
    });
    this.roleForm
      .get('eff_MonthlyRateWithAllowance')
      ?.valueChanges.subscribe((value) => {
        this.changeInBill();
      });
    this.roleForm
      .get('eff_MonthlyCostWithAllowance')
      ?.valueChanges.subscribe((value) => {
        this.changeInBill();
      });
    this.roleForm.get('roleStartDate')?.valueChanges.subscribe((startDate) => {
      this.updateMinEndDate(startDate);
      if (this.roleForm.get('roleEndDate')?.value) {
        this.generateDynamicInputs();
      }
    });
    this.roleForm.get('roleEndDate')?.valueChanges.subscribe((endDate) => {
      if (this.roleForm.get('roleStartDate')?.value) {
        this.generateDynamicInputs();
      }
    });

    if (this.roleForm.get('resource').value == 'Not Yet Assigned')
      this.isResourceNotYetAssigned = true;
    this.roleForm.get('resource')?.valueChanges.subscribe((resource) => {
      if (resource == 'Not Yet Assigned') {
        this.isResourceNotYetAssigned = true;
        this.roleForm.get('resourceName')?.setValue('');
        this.roleForm.get('resourceId')?.setValue('');
      } else this.isResourceNotYetAssigned = false;
    });
    this.roleForm.get('location')?.valueChanges.subscribe((location) => {
      if (location == 'INDIA') {
        this.currencyLabel = ' (₹)';
      } else {
        this.currencyLabel = ' ($)';
      }
    });
  }

  updateDateRange(): void {
    const projectStart = this.convertToFirstDayOfMonth(
      this.opportunityData?.projectStart
    );
    const projectEnd = this.convertToFirstDayOfMonth(
      this.opportunityData?.projectEnd
    );

    if (projectStart && projectEnd) {
      this.formattedProjectStart = this.convertToMonthYearFormat(projectStart);
      this.formattedProjectEnd = this.convertToMonthYearFormat(projectEnd);

      this.roleForm.get('roleStartDate')?.updateValueAndValidity();
      this.roleForm.get('roleEndDate')?.updateValueAndValidity();
    }
  }

  updateMinEndDate(startDate: string): void {
    const projectStart = this.convertToFirstDayOfMonth(
      this.opportunityData?.projectStart
    );
    const projectEnd = this.convertToFirstDayOfMonth(
      this.opportunityData?.projectEnd
    );

    if (startDate) {
      this.minEndDate = startDate;
      const currentEndDate = this.roleForm.get('roleEndDate')?.value;

      if (projectStart && startDate < this.formattedProjectStart) {
        this.roleForm.get('roleStartDate')?.setErrors({ min: true });
      }
      if (currentEndDate) {
        if (
          currentEndDate < startDate ||
          currentEndDate > this.formattedProjectEnd
        ) {
          this.roleForm.get('roleEndDate')?.setValue('');
        }
      }
    } else {
      this.minEndDate = '';
    }
  }
  // updateMinEndDate(startDate: string): void {
  //   if (startDate) {
  //     this.minEndDate = startDate;
  //     const currentEndDate = this.roleForm.get('roleEndDate')?.value;
  //     if (currentEndDate && currentEndDate < startDate) {
  //       this.roleForm.get('roleEndDate')?.setValue('');
  //     }
  //   } else {
  //     this.minEndDate = '';
  //   }
  // }

  convertToFirstDayOfMonth(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
    return `${year}-${month}-01T00:00:00`;
  }

  populateFormWithRLSDetailsData(): void {
    let rlsDetails = this.rlsDetailsData.rLSDetails[0];
    this.isEdit = true;
    const startDate = this.convertToMonthYearFormat(rlsDetails.roleStartDate);
    const endDate = this.convertToMonthYearFormat(rlsDetails.roleEndDate);
    if (rlsDetails.location == 'INDIA') {
      this.currencyLabel = ' (₹)';
    } else {
      this.currencyLabel = ' ($)';
    }
    console.log("rlsDetails", rlsDetails);
    this.roleForm.patchValue({
      resourceId: rlsDetails.resourceId || '',
      resourceName: rlsDetails.resourceName || '',
      resource: rlsDetails.resource || '',
      role: rlsDetails.role || '',
      primarySkill: rlsDetails.primarySkill || '',
      secondarySkill: rlsDetails.secondarySkill || '',
      experience: rlsDetails.experience || '',
      location: rlsDetails.location || '',
      hire: rlsDetails.hire || '',
      resourceType: rlsDetails.resourceType || '',
      workSlot: rlsDetails.workSlot || '',
      phase: rlsDetails.phase.toLowerCase().replace(/\s+/g, '') || '',
      tracks: rlsDetails.tracks.toLowerCase().replace(/\s+/g, '') || '',
      serviceArea: rlsDetails.serviceArea.replace(/\s+/g, '') || '',
      standardBillRate: rlsDetails.standardBillRate || 0,
      proposedBillRate: rlsDetails.proposedBillRate || 0,
      rateDeviation: rlsDetails.rateDeviation || 0,
      shiftAllowanceBillRate: rlsDetails.shiftAllowanceBillRate || 0,
      eff_HourlyRate: rlsDetails.eff_HourlyRate || 0,
      eff_MonthlyRateWithAllowance:
        rlsDetails.eff_MonthlyRateWithAllowance || 0,
      standardCost: rlsDetails.standardCost || 0,
      proposedCost: rlsDetails.proposedCost || 0,
      costDeviation: rlsDetails.costDeviation || 0,
      shiftAllowanceCost: rlsDetails.shiftAllowanceCost || 0,
      eff_HourlylyCost: rlsDetails.eff_HourlylyCost || 0,
      eff_MonthlyCostWithAllowance:
        rlsDetails.eff_MonthlyCostWithAllowance || 0,
      margin: rlsDetails.margin || 0,
      resourceCode: rlsDetails.resourceCode || '',
      remarks: rlsDetails.remarks || '',
      roleStartDate: startDate || '',
      roleEndDate: endDate || '',
      id: rlsDetails.id,
    });

    let selectedLocation = this.roleForm.get('location').value;
    let selectedRole = this.roleForm.get('role').value;
    let selectedTech = this.roleForm.get('primarySkill').value;
    let selectedExp = this.roleForm.get('experience').value;
    let selectedShift = this.roleForm.get('workSlot').value;

    this.handleSelectionChange(
      selectedLocation,
      null,
      null,
      null,
      '',
      true,
      true
    );
    this.handleSelectionChange(
      selectedLocation,
      selectedRole,
      null,
      null,
      '',
      true,
      true
    );
    this.handleSelectionChange(
      selectedLocation,
      selectedRole,
      selectedTech,
      null,
      '',
      true,
      true
    );
    this.handleSelectionChange(
      selectedLocation,
      selectedRole,
      selectedTech,
      selectedExp,
      '',
      true,
      true
    );
    this.handleSelectionChange(
      selectedLocation,
      selectedRole,
      selectedTech,
      selectedExp,
      selectedShift,
      true,
      true
    );

    this.locationDropdown = rlsDetails.location || '';
    this.roleDropdown = rlsDetails.role || '';
    this.primarySkillDropdown = rlsDetails.primarySkill || '';
    this.secondarySkillDropdown = rlsDetails.secondarySkill || '';
    this.experienceDropdown = rlsDetails.experience || '';
    this.proposedBillRate = rlsDetails.proposedBillRate || 0;
    this.proposedCost = rlsDetails.proposedCost || 0;

    // TO DO: Change this settimeout section to forkjoin in future
  }

  prepopulateRLSDetails() {
    let rlsDetails = this.rlsDetailsData.rLSDetails[0];
    // setTimeout(() => {
    this.standardBillRate = rlsDetails.standardBillRate || 0;
    this.proposedBillRate = rlsDetails.proposedBillRate || 0;
    this.deviationInRatePercent = rlsDetails.deviationInRatePercent || 0;
    this.shiftAllowanceBillRate = rlsDetails.shiftAllowanceBillRate || 0;
    this.eff_HourlyRate = rlsDetails.eff_HourlyRate || 0;
    this.eff_MonthlyRateWithAllowance =
      rlsDetails.eff_MonthlyRateWithAllowance || 0;

    this.standardCost = rlsDetails.standardCost || 0;
    this.proposedCost = rlsDetails.proposedCost || 0;
    this.deviationInCostPercent = rlsDetails.deviationInCostPercent || 0;
    this.shiftAllowanceCost = rlsDetails.shiftAllowanceCost || 0;
    this.eff_HourlylyCost = rlsDetails.eff_HourlylyCost || 0;
    this.eff_MonthlyCostWithAllowance =
      rlsDetails.eff_MonthlyCostWithAllowance || 0;
    this.marginValue = rlsDetails.margin || 0;
    // }, 1500);

    // setTimeout(() => {
    this.generateDynamicInputs();
    // }, 100);
  }

  convertToMonthYearFormat(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    return `${year}-${month}`;
  }

  cancel() {
    this.dialog.closeAll();
  }

  preventTyping(event: KeyboardEvent) {
    event.preventDefault();
  }

  onSubmit() {
    if (
      (this.roleForm.get('resourceType').value == 'Billable' &&
        this.proposedBillRate == 0) ||
      this.proposedCost == 0
    )
      this.isSubmitDisabled = true;
    else if (
      this.roleForm.get('resourceType').value == 'Non-Billable' &&
      this.proposedCost == 0
    )
      this.isSubmitDisabled = true;
    else this.isSubmitDisabled = false;

    if (this.isSubmitDisabled) {
      if (this.roleForm.get('resourceType').value == 'Non-Billable') {
        this.snackBar.open('Please Enter Proposed Cost', 'Close', {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      } else {
        this.snackBar.open(
          'Please Enter Proposed Bill Rate and Cost',
          'Close',
          {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center',
          }
        );
      }
    }
    if (this.roleForm.valid && !this.isSubmitDisabled) {
      const allocations = this.resourceDetails;
      let rolestartDate = this.roleForm.get('roleStartDate').value;
      let roleenddDate = this.roleForm.get('roleEndDate').value;
      this.roleForm.patchValue({
        roleStartDate: rolestartDate + '-01',
        roleEndDate: roleenddDate + '-01',
      });
      const combinedData = {
        opportunity: this.opportunityData,
        rLSDetails: this.roleForm.value,
        rLSAllocations: allocations,
      };
      this.oppRlsExpService.saveOpportunityData(combinedData).subscribe(
        (res: any) => {
          if (!res.isError) {
            this.dialog.closeAll();
            let editOpportunityObject = {
              opportunityId: this.opportunityData.opportunityId,
              id: res.data ?? 0
            }
            this.oppRlsExpService
              .getOpportunityAndRLSDetails(editOpportunityObject)
              .subscribe((res: any) => {
                this.oppRlsExpService.setRLSData(res);
                this.oppRlsExpService.setExpenseData(res);
                this.oppRlsExpService.updateOpportunityWiseMarginData(
                  res?.opportunityWiseMargin
                );
                this.oppRlsExpService.updateOpportunityData(res.opportunity);
              });
          } else {
            this.roleForm.patchValue({
              roleStartDate: rolestartDate,
              roleEndDate: roleenddDate,
            });
          }
        },
        (error) => {
          this.roleForm.patchValue({
            roleStartDate: rolestartDate,
            roleEndDate: roleenddDate,
          });
        }
      );
    }
  }
  onPrimaryorSecondaryChange(): void {
    const selectedPrimarySkill = this.roleForm.get('primarySkill')?.value;
    // Filter the technologies for the secondary skill dropdown
    this.filteredSFTechnologies = this.allSFTechnologies?.filter(
      (tech) => tech.value != selectedPrimarySkill
    );
    // Clear the secondary skill if the current selection is no longer valid
    if (this.roleForm.get('secondarySkill')?.value === selectedPrimarySkill) {
      this.roleForm.get('secondarySkill')?.setValue('');
    }
  }
  onLocationChange(event: any, apiToBeCalled: string): void {
    this.apiToBeCalled = apiToBeCalled;
    const selectedLocationId = event.target.value;
    this.selectedLocation = this.allSFLocations.find(
      (location) => location.value == selectedLocationId
    );
    this.selectedLocation =
      this.roleForm.get('location').value ?? this.selectedLocation;
    if (this.selectedLocation) {
      this.handleSelectionChange(
        this.selectedLocation,
        this.selectedRole,
        this.selectedTechnology,
        this.selectedExperience,
        this.selectedShift
      );
      this.roleForm.patchValue({ workSlot: '' });
      this.shiftAllowanceBillRate = this.shiftAllowanceCost = 0;
    }
  }

  handleSelectionChange(
    selectedLocation: any,
    selectedRole: any,
    selectedTechnology: any,
    selectedExperience: any,
    selectedShift: string,
    fetchCall = false,
    prepopulateRLSDetails = false
  ): void {
    let selectionObject: RLSInputBindingModel = {
      startDate: null,
      endDate: null,
      shiftType: '',
      location: '',
      role: '',
      technology: '',
      experience: '',
    };
    selectionObject.location =
      this.roleForm.get('location').value ??
      selectedLocation?.value ??
      selectedLocation;
    selectionObject.role =
      this.roleForm.get('role').value ?? selectedRole?.value ?? selectedRole;
    selectionObject.technology =
      this.roleForm.get('primarySkill').value ??
      selectedTechnology?.value ??
      selectedTechnology;
    selectionObject.experience =
      this.roleForm.get('experience').value ??
      selectedExperience?.value ??
      selectedExperience;
    selectionObject.shiftType =
      this.roleForm.get('workSlot').value ?? selectedShift;

    if (this.apiToBeCalled == 'location' || (!selectedRole && fetchCall))
      this.oppRlsExpService
        .getAllSFRole(selectionObject)
        .subscribe((res: any) => {
          this.allSFRoles = res;
          if (prepopulateRLSDetails) {
            this.prepopulateRLSDetails();
          }
        });
    else if (this.apiToBeCalled == 'role' || (!selectedTechnology && fetchCall))
      this.oppRlsExpService
        .getAllSFTechnology(selectionObject)
        .subscribe((res: any) => {
          this.allSFTechnologies = res;
          this.filteredSFTechnologies = res;
          if (prepopulateRLSDetails) {
            this.prepopulateRLSDetails();
          }
        });
    else if (this.apiToBeCalled == 'tech' || (!selectedExperience && fetchCall))
      this.oppRlsExpService
        .getAllSFExperience(selectionObject)
        .subscribe((res: any) => {
          this.allSFExperience = res;
          if (prepopulateRLSDetails) {
            this.prepopulateRLSDetails();
          }
        });
    else if (
      this.apiToBeCalled == 'shift' ||
      (selectedShift != '' && fetchCall)
    ) {
      this.oppRlsExpService
        .getShiftAllowance(selectionObject)
        .subscribe((res: any) => {
          this.shiftAllowanceBillRate = res?.shiftAllowanceBillRate ?? 0;
          this.shiftAllowanceCost = res?.shiftAllowanceCost ?? 0;
          if (this.roleForm.get('resourceType').value == 'Non-Billable') {
            this.temporaryShiftAllowanceBillRate =
              this.shiftAllowanceBillRate ?? 0;
            this.proposedBillRate =
              this.standardBillRate =
              this.shiftAllowanceBillRate =
              0;
          }
          if (prepopulateRLSDetails) {
            this.prepopulateRLSDetails();
          }
          // if (this.standardBillRate == 0) this.shiftAllowanceBillRate = 0;
          // if (this.standardCost == 0) this.shiftAllowanceCost = 0;
          setTimeout(() => {
            this.changeInBill();
          }, 100);
        });
    } else {
      // this.oppRlsExpService
      //   .getBillRateAndResourceCode(selectionObject)
      //   .subscribe((res: any) => {
      //     if (selectionObject.location.toLowerCase() == 'india') {
      //       this.standardBillRate = res[res.length - 1].billRateInINR;
      //       this.proposedBillRate =
      //         res[res.length - 1].billRateInINR ??
      //         this.rlsDetailsData?.rLSDetails[0].proposedBillRate;
      //     } else {
      //       this.standardBillRate = res[res.length - 1].billRateInUSD;
      //       this.proposedBillRate =
      //         res[res.length - 1].billRateInUSD ??
      //         this.rlsDetailsData?.rLSDetails[0].proposedBillRate;
      //     }
      //     if (this.roleForm.get('resourceType').value == 'Non-Billable') {
      //       this.temporaryProposedBillRate =
      //         this.roleForm.get('proposedBillRate')?.value ?? 0;
      //       this.temporaryStandardBillRate =
      //         this.roleForm.get('standardBillRate')?.value ?? 0;
      //       this.temporaryShiftAllowanceBillRate =
      //         this.roleForm.get('shiftAllowanceBillRate')?.value ?? 0;
      //       this.proposedBillRate =
      //         this.standardBillRate =
      //         this.shiftAllowanceBillRate =
      //         0;
      //     }
      //     if (prepopulateRLSDetails) {
      //       this.prepopulateRLSDetails();
      //     }
      //   });
      this.oppRlsExpService
        .getCostAndResourceCode(selectionObject)
        .subscribe((res: any) => {
          this.resourceCode = res[res.length - 1].resourceCode;
          if (selectionObject.location.toLowerCase() == 'india') {
            this.standardBillRate = res[res.length - 1].billRateInINR;
            this.proposedBillRate =
              res[res.length - 1].billRateInINR ??
              this.rlsDetailsData?.rLSDetails[0].proposedBillRate;

            this.standardCost = res[res.length - 1].costRateInINR;
            this.proposedCost =
              res[res.length - 1].costRateInINR ??
              this.rlsDetailsData?.rLSDetails[0].proposedCost;
          } else {
            this.standardBillRate = res[res.length - 1].billRateInUSD;
            this.proposedBillRate =
              res[res.length - 1].billRateInUSD ??
              this.rlsDetailsData?.rLSDetails[0].proposedBillRate;

            this.standardCost = res[res.length - 1].costRateInUSD;
            this.proposedCost =
              res[res.length - 1].costRateInUSD ??
              this.rlsDetailsData?.rLSDetails[0].proposedCost;
          }

          if (this.roleForm.get('resourceType').value == 'Non-Billable') {
            this.temporaryProposedBillRate =
              this.roleForm.get('proposedBillRate')?.value ?? 0;
            this.temporaryStandardBillRate =
              this.roleForm.get('standardBillRate')?.value ?? 0;
            this.temporaryShiftAllowanceBillRate =
              this.roleForm.get('shiftAllowanceBillRate')?.value ?? 0;
            this.proposedBillRate =
              this.standardBillRate =
              this.shiftAllowanceBillRate =
              0;
          }

          if (prepopulateRLSDetails) {
            this.prepopulateRLSDetails();
          }

          setTimeout(() => {
            this.changeInBill();
          }, 100);
        });
    }
  }

  onRoleChange(event: any, apiToBeCalled: string): void {
    this.apiToBeCalled = apiToBeCalled;
    const selectedRoleId = event.target.value;
    this.selectedRole = this.allSFRoles.find(
      (role) => role.value == selectedRoleId
    );
    this.selectedRole = this.roleForm.get('role').value ?? this.selectedRole;
    if (this.selectedRole) {
      this.handleSelectionChange(
        this.selectedLocation,
        this.selectedRole,
        this.selectedTechnology,
        this.selectedExperience,
        this.selectedShift
      );
    }
  }

  onTechnologyChange(event: any, apiToBeCalled: string): void {
    this.apiToBeCalled = apiToBeCalled;
    // const selectedTechnologyId = event.target.value;
    this.selectedTechnology = this.roleForm.get('primarySkill').value;
    //  this.allSFTechnologies.find(tech => tech.value == selectedTechnologyId);
    if (this.selectedTechnology) {
      this.handleSelectionChange(
        this.selectedLocation,
        this.selectedRole,
        this.selectedTechnology,
        this.selectedExperience,
        this.selectedShift
      );
    }
  }

  onExperienceChange(event: any, apiToBeCalled: string): void {
    this.apiToBeCalled = apiToBeCalled;
    const selectedExperienceId = event.target.value;
    this.selectedExperience = this.allSFExperience.find(
      (exp) => exp.value == selectedExperienceId
    );
    this.selectedExperience =
      this.roleForm.get('experience').value ?? this.selectedExperience;
    if (this.selectedExperience) {
      this.handleSelectionChange(
        this.selectedLocation,
        this.selectedRole,
        this.selectedTechnology,
        this.selectedExperience,
        this.selectedShift
      );
    }
  }

  onShiftChange(event: any, apiToBeCalled: string): void {
    this.apiToBeCalled = apiToBeCalled;
    const selectedShift = event.target.value;
    // this.selectedShift = selectedShift
    this.selectedShift = this.roleForm.get('workSlot').value ?? selectedShift;
    if (this.selectedShift) {
      this.handleSelectionChange(
        this.selectedLocation,
        this.selectedRole,
        this.selectedTechnology,
        this.selectedExperience,
        this.selectedShift
      );
    }
  }

  changeInBill(event?: any) {
    const standardBillRateValue =
      this.roleForm.get('standardBillRate')?.value ?? 0;
    const eff_MonthlyRateWithAllowance =
      this.roleForm.get('eff_MonthlyRateWithAllowance')?.value ?? 0;
    const eff_MonthlyCostWithAllowance =
      this.roleForm.get('eff_MonthlyCostWithAllowance')?.value ?? 0;
    const propsedBillRateValue =
      this.roleForm.get('proposedBillRate')?.value ?? 0;
    const standardCostValue = this.roleForm.get('standardCost')?.value ?? 0;
    const propsedCostValue = this.roleForm.get('proposedCost')?.value ?? 0;

    let deviationRate =
      ((propsedBillRateValue - standardBillRateValue) * 100) /
      standardBillRateValue;

    if (deviationRate != -Infinity && deviationRate != Infinity)
      this.deviationInRatePercent = isNaN(deviationRate)
        ? 0
        : parseFloat(deviationRate.toFixed(2));
    else this.deviationInRatePercent = 0;

    let deviationCost =
      ((standardCostValue - propsedCostValue) * 100) / standardCostValue;
    if (deviationCost != -Infinity && deviationCost != Infinity)
      this.deviationInCostPercent = isNaN(deviationCost)
        ? 0
        : parseFloat(deviationCost.toFixed(2)) ?? 0;
    else this.deviationInCostPercent = 0;

    if (propsedBillRateValue == 0) {
      this.eff_HourlyRate = parseFloat(
        (standardBillRateValue / 160).toFixed(2)
      );
      this.eff_MonthlyRateWithAllowance =
        standardBillRateValue + this.shiftAllowanceBillRate;
    } else {
      this.eff_HourlyRate = parseFloat((propsedBillRateValue / 160).toFixed(2));
      this.eff_MonthlyRateWithAllowance =
        propsedBillRateValue + this.shiftAllowanceBillRate;
    }
    if (propsedCostValue == 0) {
      this.eff_HourlylyCost = parseFloat((standardCostValue / 160).toFixed(2));
      this.eff_MonthlyCostWithAllowance =
        standardCostValue + this.shiftAllowanceCost;
    } else {
      this.eff_HourlylyCost = parseFloat((propsedCostValue / 160).toFixed(2));
      this.eff_MonthlyCostWithAllowance =
        propsedCostValue + this.shiftAllowanceCost;
    }

    let margin =
      ((eff_MonthlyRateWithAllowance - eff_MonthlyCostWithAllowance) * 100) /
      eff_MonthlyRateWithAllowance;

    if (margin != -Infinity && margin != Infinity)
      this.marginValue = isNaN(margin) ? 0 : parseFloat(margin.toFixed(2));
    else this.marginValue = 0;
  }

  onResourceChange(event: any) {
    const resourceType = event.target.value;
    if (resourceType == 'Non-Billable') {
      this.temporaryProposedBillRate =
        this.roleForm.get('proposedBillRate')?.value ?? 0;
      this.temporaryStandardBillRate =
        this.roleForm.get('standardBillRate')?.value ?? 0;
      this.temporaryShiftAllowanceBillRate =
        this.roleForm.get('shiftAllowanceBillRate')?.value ?? 0;
      this.proposedBillRate =
        this.standardBillRate =
        this.shiftAllowanceBillRate =
        0;
    } else {
      this.onResourceChangeExtended();
      if(this.temporaryProposedBillRate > 0)
        this.proposedBillRate = this.temporaryProposedBillRate;
      if(this.temporaryStandardBillRate > 0)
        this.standardBillRate = this.temporaryStandardBillRate;
      if(this.temporaryShiftAllowanceBillRate > 0)
        this.shiftAllowanceBillRate = this.temporaryShiftAllowanceBillRate;
    }
    // if (this.standardBillRate == 0) this.shiftAllowanceBillRate = 0;
    // if (this.standardCost == 0) this.shiftAllowanceCost = 0;
    setTimeout(() => {
      this.changeInBill();
    }, 200);
  }

  onResourceChangeExtended() {
    let selectionObject: RLSInputBindingModel = {
      startDate: null,
      endDate: null,
      shiftType: '',
      location: '',
      role: '',
      technology: '',
      experience: '',
    };

    selectionObject.location = this.roleForm.get('location').value;
    selectionObject.role = this.roleForm.get('role').value;
    selectionObject.technology = this.roleForm.get('primarySkill').value;
    selectionObject.experience = this.roleForm.get('experience').value;
    selectionObject.shiftType = this.roleForm.get('workSlot').value;

    this.oppRlsExpService
      .getCostAndResourceCode(selectionObject)
      .subscribe((res: any) => {
        if (selectionObject.location.toLowerCase() == 'india') {
          this.standardBillRate = res[res.length - 1].billRateInINR;
          this.proposedBillRate =
            res[res.length - 1].billRateInINR ??
            this.rlsDetailsData?.rLSDetails[0].proposedBillRate;
        } else {
          this.standardBillRate = res[res.length - 1].billRateInUSD;
          this.proposedBillRate =
            res[res.length - 1].billRateInUSD ??
            this.rlsDetailsData?.rLSDetails[0].proposedBillRate;
        }
        setTimeout(() => {
          this.changeInBill();
        }, 100);
      });
  }

  generateDynamicInputs() {
    this.isAddButtonClicked = true;
    this.resourcesAvailable = true;
    const startDate = new Date(
      (<HTMLInputElement>document.getElementById('start-date'))?.value
    );
    const endDate = new Date(
      (<HTMLInputElement>document.getElementById('end-date'))?.value
    );
    const dynamicInputsSection = document.getElementById(
      'dynamic-inputs-section'
    );

    dynamicInputsSection.innerHTML = '';
    this.resourceDetails = [];
    let allocations: any[] = this.rlsDetailsData
      ? [...this.rlsDetailsData?.rLSAllocations]
      : [];

    let i = 0;
    let resourceDetail: ResourceDetail;
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setMonth(d.getMonth() + 1)
    ) {
      const monthYear = `${d.toLocaleString('default', { month: 'short' })}'${
        d.getFullYear() % 100
      }:`;


      const label = document.createElement('label');
      label.textContent = monthYear;
      label.className = 'dynamic-label';

      const input = document.createElement('input');
      input.type = 'number';
      input.className = 'dynamic-input';

      let lastResourceCount = allocations[i]?.resourceCount ?? 1;

      if (allocations?.length > 0) {
        input.value = allocations[i]?.resourceCount ?? 1;
        resourceDetail = {
          SF_RLS_Details_Id: allocations[i]?.sF_RLS_Details_Id ?? 0,
          ResourceCount: parseFloat(input.value),
          Month: d.getMonth() + 1,
          Year: d.getFullYear(),
        };
      } else {
        input.value = '1'; // Default value
        resourceDetail = {
          SF_RLS_Details_Id: 0,
          ResourceCount: parseFloat(input.value),
          Month: d.getMonth() + 1,
          Year: d.getFullYear(),
        };
      }

      dynamicInputsSection.appendChild(label);
      dynamicInputsSection.appendChild(input);

      this.resourceDetails.push(resourceDetail);

      // Add 'blur' event listener to handle empty fields
      input.addEventListener('blur', ((index) => (event: any) => {
        if (event.target.value.trim() === '') {
          const lastResourceCount = allocations[index]?.resourceCount ?? 1; // Default value
          event.target.value = lastResourceCount;
      
          if (this.resourceDetails[index]) {
            this.resourceDetails[index].ResourceCount = parseFloat(lastResourceCount);
          }
        }
      })(i));
  
      input.addEventListener(
        'input',
        ((index, month, year) => (event: any) => {
          const newValue = parseFloat(event.target.value);
          if (!isNaN(newValue)) {
            lastResourceCount = newValue;
            this.resourceDetails[index].ResourceCount = newValue;
          }
        })(this.resourceDetails.length - 1, d.getMonth() + 1, d.getFullYear())
      );
      i++;
    }
  }
}
