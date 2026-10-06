import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { filter, map } from 'lodash';

import {
  CONFIRM_VALUES, PLACEMENT_TYPE, CURRENCY_TYPE, BILLING_TYPE, EMPLOYMENT_TYPE, BILLING_FREQUENCY,
  EDUCATION_TYPE, SERVICE_TYPE, AUTHORIZATION_STATUS, PAYMENT_TYPE, SKILLS_LIST
} from 'src/app/common/configuration.settings';
import { ToastService } from 'src/app/common/toast/toast.service';
import { RequestResourceService } from '../request-resource.service';

@Component({
  selector: 'app-add-edit-rr',
  templateUrl: './add-edit-rr.component.html',
  styleUrls: ['./add-edit-rr.component.scss']
})
export class AddEditRrComponent implements OnInit {

  billingTypeList: any = BILLING_TYPE;
  billingFrequencyList: any = BILLING_FREQUENCY;
  yesNoValues: any = CONFIRM_VALUES;
  placementTypeValues: any = PLACEMENT_TYPE;
  currencyList: any = CURRENCY_TYPE;
  employmentTypeList: any = EMPLOYMENT_TYPE;
  educationTypeList: any = EDUCATION_TYPE;
  paymentTypeList: any = PAYMENT_TYPE;
  serviceTypeList: any = SERVICE_TYPE;
  authorizationStatus: any = AUTHORIZATION_STATUS;
  skillsList: any = SKILLS_LIST;
  countryList: any;
  technologyList: any;
  COEList: any;
  jobTitleList: any;
  experienceList: any;
  proficiencyList: any;
  projectList: any;
  reportingManagerList: any;
  requesterList: any;
  rolesList: any;
  workLocationList: any;
  accountList: any;
  preferredSkillsList: any;
  resourceAction: string;
  isAddRR: any;
  resourceRequestId: any;
  isBackFillSelected: any;
  addRRForm: FormGroup;
  isBillable: any;
  resourceRequestDetail: any;
  durationDate: any;
  projectEndDate: any;
  mustHaveSkills: any;
  goodToHaveSkills: any;
  customerCommitDate: any;
  roleDurationDate: any;
  isTravelInvolved: boolean;

  constructor(private requestService: RequestResourceService, private toastService: ToastService, private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    this.isBackFillSelected = true;
    this.isTravelInvolved = true;
    this.isBillable = true;
    this.projectEndDate = undefined;
    this.durationDate = undefined;
    this.customerCommitDate = undefined;
    this.roleDurationDate = undefined;
  }

  ngOnInit(): void {

    this.formInitialization();
    this.getAllCountry();
    this.getAllTechnologyList();
    this.getAllCOEList();
    this.getAllJobTitleList();
    this.getAllExperienceList();
    this.getAllProficiencyList();
    this.getAllReportingManagerList();
    // this.getAllRequesterList();
    this.getAllRolesList();
    this.getAllAccountList();
    this.getAllPreferredSkillsList();
    this.getAllWorkLocationList('INDIA');
    this.activatedRoute.queryParams.subscribe((params) => {
      this.resourceAction = params.isAdd === "true" ? 'New ' : 'Edit ';
      this.isAddRR = params.isAdd;
      if (params.isAdd !== "true") {
        this.resourceRequestId = parseInt(params.id);
        this.getRRDetail(this.resourceRequestId);
      }
    });
  }

  formInitialization(data?) {
    this.addRRForm = this.formBuilder.group({
      'opportunityID': [data ? data.rrOpportunityId : null, [Validators.required]],
      'location': [data ? data.location : null, [Validators.required]],
      'requester': [data ? data.requester : null, [Validators.required]],
      'role': [data ? data.role : null, [Validators.required]],
      'placement': [data ? data.isBackfill : null, [Validators.required]],
      'backfillFor': [data ? data.backFillFor : 'null', [Validators.required]],
      'workLocation': [data ? data.workLocation : null, [Validators.required]],
      'jobTitle': [data ? data.jobTitle : null, [Validators.required]],
      'noOfPosition': [data ? data.noOfPositions : null, [Validators.required]],
      'sowSigned': [data ? data.isSowSigned : null, [Validators.required]],
      'minExperience': [data ? data.minExperience : null, [Validators.required]],
      'budgetedCost': [data ? data.budgetedSoldCost : null, [Validators.required]],
      'serviceType': [data ? data.serviceType : 0, [Validators.required]],
      'coe': [data ? data.coe : 0, [Validators.required]],
      'projectName': [data ? data.projectId : 0, [Validators.required]],
      'proficiency': [data ? data.proficiency : 0, [Validators.required]],
      'employmentType': [data ? data.employmentType : null, [Validators.required]],
      'employmentPayment': [data ? data.employmentPayment : null, [Validators.required]],
      'commitDate': [data ? this.datepipe.transform(data.customerCommitDate, 'MM/dd/yyyy') : null, [Validators.required]],
      'accountName': [data ? data.accountId : 0, [Validators.required]],
      'roleDuration': [data ? this.datepipe.transform(data.roleDurationOnProject, 'MM/dd/yyyy') : null],
      'technology': [data ? data.technology : 'null'],
      'rlsCode': [data ? data.rlsCode : null],
      'rolesResponsibilities': [data ? data.roleAndResponsibilities : null, [Validators.required]],
      'roleOverview': [data ? data.roleOverview : null, [Validators.required]],
      'projectOverview': [data ? data.projectOverview : null],
      'comments': [data ? data.comments : null],
      'reportingManager': [data ? data.reportingManager : null],
      'client': [data ? data.clientReview : null],
      'internalInterviewers': [data ? data.interviewers : null],
      'billingType': [data ? data.isBillable : null, [Validators.required]],
      'billingFrequency': [data ? data.billFrequency : null, [Validators.required]],
      'billingCurrency': [data ? data.currency : null, [Validators.required]],
      'billRate': [data ? data.billRate : null, [Validators.required]],
      'workAuthorizationStatus': [data ? data.workAuthorizationStatus : null, [Validators.required]],
      'remoteWork': [data ? data.remoteWorkAvailable : null, [Validators.required]],
      'travelInvolved': [data ? data.travelInvolved : null, [Validators.required]],
      'travelValue': [data ? data.travelPercentage : null, [Validators.required]],
      'minimumEducation': [data ? data.minEducationReq : null],
      'preferredSkills': this.formBuilder.array([]),
    });
    if (!data) {
      this.addSkillOption(5);
    } else {
      let mustHaveArray, niceHaveArray;
      const mustHaveLength = data.musttoHaveSkill ? data.musttoHaveSkill.split('&&') : '';
      const niceToHaveLength = data.niceToHaveSkills ? data.niceToHaveSkills.split('&&') : '';
      data.skillArrayLength = mustHaveLength.length + niceToHaveLength.length;
      if (mustHaveLength) {
        mustHaveArray = mustHaveLength.map((item) => {
          const obj = {
            'skill': item,
            'option': 'Must have'
          }
          return obj;
        });
      } else {
        mustHaveArray = [];
      }
      if (niceToHaveLength) {
        niceHaveArray = niceToHaveLength.map((item) => {
          const obj = {
            'skill': item,
            'option': 'Good to have'
          }
          return obj;
        });
      } else {
        niceHaveArray = [];
      }
      data.skillArray = mustHaveArray.concat(niceHaveArray);
      this.addSkillOption(data.skillArrayLength, data);
    }
  }

  addSkillOption(length, data?) {
    const optionValues = this.addRRForm.controls['preferredSkills'].value;
    if (optionValues.length && (!optionValues[optionValues.length - 1].skillName || !optionValues[optionValues.length - 1].skillOption)) {
      this.toastService.showWarning('Preferred skills cannot be empty', 'Alert');
      return;
    }
    const control = <FormArray>this.addRRForm.controls['preferredSkills'];
    for (let i = 1; i <= length; i++) {
      if (data) {
        const addrCtrl = this.initSkillOption(data.skillArray[i - 1]);
        control.push(addrCtrl);
      } else {
        const addrCtrl = this.initSkillOption();
        control.push(addrCtrl);
      }
    }
  }

  initSkillOption(data?) {
    return this.formBuilder.group({
      skillName: [data ? data.skill : '', [Validators.required]],
      skillOption: [data ? data.option : '0', [Validators.required]],
    });
  }

  get formData() {
    return <FormArray>this.addRRForm.get('preferredSkills');
  }

  get preferredSkills(): FormArray {
    return this.addRRForm.get('preferredSkills') as FormArray;
  }

  getRRDetail(rrId) {
    this.requestService.getRRById(rrId).subscribe((response: any) => {
      if (response) {
        this.resourceRequestDetail = response;
        this.getAllWorkLocationList(this.resourceRequestDetail.location);
        this.projectEndDate = this.resourceRequestDetail.isProjectEndDate;
        this.durationDate = this.resourceRequestDetail.isProjectEndDate ? false : true;
        this.isBillable = this.resourceRequestDetail.isBillable;
        this.isBackFillSelected = this.resourceRequestDetail.isBackfill;
        this.getProjectListByAcc(this.resourceRequestDetail.accountId);
        this.formInitialization(this.resourceRequestDetail);
        this.updateFieldsBasedOnResponse();
        this.customerCommitDate = this.addRRForm.value.commitDate;
        this.roleDurationDate = this.addRRForm.value.roleDuration;
        this.isTravelInvolved = this.resourceRequestDetail.travelInvolved;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  updateFieldsBasedOnResponse() {
    //work location
    if (this.resourceRequestDetail.location === 'INDIA') {
      this.addRRForm.controls['workAuthorizationStatus'].disable({ onlySelf: true });
    }
    // backfill for
    this.addRRForm.get('backfillFor')[this.isBackFillSelected ? 'enable' : 'disable']();
    // travel involved
    this.resourceRequestDetail.travelInvolved ? this.addRRForm.controls['travelValue'].enable() : this.addRRForm.controls['travelValue'].disable({ onlySelf: true });
    // billing type
    this.isBillable ? this.addRRForm.controls['billingFrequency'].enable() : this.addRRForm.controls['billingFrequency'].disable();
    this.isBillable ? this.addRRForm.controls['billingCurrency'].enable() : this.addRRForm.controls['billingCurrency'].disable();
    this.isBillable ? this.addRRForm.controls['billRate'].enable() : this.addRRForm.controls['billRate'].disable();
  }

  getAllCountry() {
    this.requestService.getCountryList().subscribe((response: any) => {
      if (response) {
        this.countryList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllTechnologyList() {
    this.requestService.getTechnologyList().subscribe((response: any) => {
      if (response) {
        this.technologyList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllCOEList() {
    this.requestService.getCOEList().subscribe((response: any) => {
      if (response) {
        this.COEList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllJobTitleList() {
    this.requestService.getJobTitleList().subscribe((response: any) => {
      if (response) {
        this.jobTitleList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllExperienceList() {
    this.requestService.getExperienceList().subscribe((response: any) => {
      if (response) {
        this.experienceList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllProficiencyList() {
    this.requestService.getProficiencyList().subscribe((response: any) => {
      if (response) {
        this.proficiencyList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllProjectList() {
    this.requestService.getProjectList().subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getProjectListByAcc(accountId) {
    this.requestService.getProjectByAccountName(accountId).subscribe((response: any) => {
      if (response) {
        this.projectList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllReportingManagerList() {
    this.requestService.getReportingManagerList().subscribe((response: any) => {
      if (response) {
        this.reportingManagerList = response;
        this.requesterList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  // don't need to use this since reporting manager API returns same response
  // getAllRequesterList() {
  //   this.requestService.getRequesterList().subscribe((response: any) => {
  //     if (response) {
  //       this.requesterList = response;
  //     }
  //   }, (error: any) => {
  //     this.toastService.showError(error, 'Error');
  //   })
  // }

  getAllRolesList() {
    this.requestService.getRolesList().subscribe((response: any) => {
      if (response) {
        this.rolesList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllWorkLocationList(countryName) {
    this.requestService.getWorkLocationList(countryName).subscribe((response: any) => {
      if (response) {
        this.workLocationList = response;
        // this.addRRForm.controls.workLocation.patchValue(this.resourceRequestDetail?.workLocation);
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllAccountList() {
    this.requestService.getAccountList().subscribe((response: any) => {
      if (response) {
        this.accountList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllPreferredSkillsList() {
    this.requestService.getPreferredSkillsList().subscribe((response: any) => {
      if (response) {
        this.preferredSkillsList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  onSelectCountry(event) {
    const countryName = event.target.value;
    this.addRRForm.controls['workLocation'].reset();
    this.getAllWorkLocationList(countryName);
    if (countryName === 'INDIA') {
      this.addRRForm.controls['workAuthorizationStatus'].disable();
      this.addRRForm.controls['workAuthorizationStatus'].reset();
    } else {
      this.addRRForm.controls['workAuthorizationStatus'].enable();
    }
  }

  generateRequestBody() {
    const object = {
      "NoOfPositions": parseInt(this.addRRForm.value.noOfPosition),
      "RROpportunityId": this.addRRForm.value.opportunityID,
      "MusttoHaveSkill": this.mustHaveSkills,
      "NiceToHaveSkills": this.goodToHaveSkills,
      "AccountId": parseInt(this.addRRForm.value.accountName),
      "Comments": this.addRRForm.value.comments || null,
      "TravelInvolved": this.addRRForm.value.travelInvolved ? Boolean(JSON.parse(this.addRRForm.value.travelInvolved)) : false,
      "BackFillFor": this.addRRForm.value.backfillFor || null,
      "BillFrequency": this.addRRForm.value.billingFrequency,
      "Currency": this.addRRForm.value.billingCurrency,
      "IsBillable": this.addRRForm.value.billingType ? Boolean(JSON.parse(this.addRRForm.value.billingType)) : false,
      "COE": parseInt(this.addRRForm.value.coe),
      "CustomerCommitDate": this.datepipe.transform(this.addRRForm.value.commitDate, 'yyyy-MM-dd', 'es-ES') || null,
      "EmploymentPayment": this.addRRForm.value.employmentPayment,
      "BudgetedSoldCost": this.addRRForm.value.budgetedCost || 0,
      "EmploymentType": this.addRRForm.value.employmentType,
      "TravelPercentage": this.addRRForm.value.travelValue || 0,
      "JobTitle": this.addRRForm.value.jobTitle,
      "Location": this.addRRForm.value.location,
      "MinExperience": this.addRRForm.value.minExperience,
      "IsProjectEndDate": this.projectEndDate,
      "PLACEMENT": null,
      "PROFICIENCY": parseInt(this.addRRForm.value.proficiency),
      "PROJECTID": parseInt(this.addRRForm.value.projectName),
      "PROJECTOVERVIEW": this.addRRForm.value.projectOverview || null,
      "INTERVIEWERS": this.addRRForm.value.internalInterviewers || null,
      "REMOTEWORKAVAILABLE": this.addRRForm.value.remoteWork ? Boolean(JSON.parse(this.addRRForm.value.remoteWork)) : false,
      "REPORTINGMANAGER": this.addRRForm.value.reportingManager || null,
      "REQUESTER": this.addRRForm.value.requester,
      "RLSCODE": this.addRRForm.value.rlsCode || null,
      "ROLE": this.addRRForm.value.role,
      "ROLEANDRESPONSIBILITIES": this.addRRForm.value.rolesResponsibilities,
      "ROLEDURATIONONPROJECT": this.datepipe.transform(this.addRRForm.value.roleDuration, 'yyyy-MM-dd', 'es-ES') || null,
      "ROLEOVERVIEW": this.addRRForm.value.roleOverview,
      "SERVICETYPE": parseInt(this.addRRForm.value.serviceType),
      "ISSOWSIGNED": this.addRRForm.value.sowSigned ? Boolean(JSON.parse(this.addRRForm.value.sowSigned)) : false,
      "TECHNOLOGY": this.addRRForm.value.technology || null,
      "WORKAUTHORIZATIONSTATUS": this.addRRForm.value.workAuthorizationStatus,
      "WORKLOCATION": this.addRRForm.value.workLocation,
      "ClientReview": this.addRRForm.value.client || false,
      "MinEducationReq": this.addRRForm.value.minimumEducation || null,
      "billRate": this.addRRForm.value.billRate || 0,
      "isBackFill": this.addRRForm.value.placement || false,
    }
    return object;
  }

  modifyPreferredSkills() {
    if (this.addRRForm.controls.preferredSkills.value) {
      this.mustHaveSkills = map(filter(this.addRRForm.controls.preferredSkills.value, { skillOption: "Must have" }), 'skillName').join('&&');
      this.goodToHaveSkills = map(filter(this.addRRForm.controls.preferredSkills.value, { skillOption: "Good to have" }), 'skillName').join('&&');
    }
  }

  onSubmitRRForm() {
    this.checkValueSelected();
    this.addRRForm.markAllAsTouched();
    if (!this.addRRForm.valid) {
      return;
    }
    this.modifyPreferredSkills();
    const requestBody = this.generateRequestBody();
    requestBody['Id'] = this.isAddRR === 'true' ? 0 : this.resourceRequestId;
    requestBody['NoOfPositions'] = this.isAddRR === 'true' ? parseInt(this.addRRForm.value.noOfPosition) : 1;
    this.requestService.saveRequestResource(requestBody).subscribe((response: any) => {
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success');
        this.addRRForm.reset();
        this.router.navigate(['/request-resource']);
      } else {
        this.toastService.showError(response.message, 'Error');
        return;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  onSelectPlacement(isEdit) {
    if (!isEdit) {
      this.isBackFillSelected = this.addRRForm.value.placement ? true : false;
    }
    if (this.isBackFillSelected) {
      this.addRRForm.controls['backfillFor'].enable();
    } else {
      this.addRRForm.controls['backfillFor'].disable();
      this.addRRForm.controls['backfillFor'].reset();
    }
  }

  onSelectTravel() {
    this.isTravelInvolved = this.addRRForm.value.travelInvolved ? true : false;
    this.isTravelInvolved ? this.addRRForm.controls['travelValue'].enable() : this.addRRForm.controls['travelValue'].disable();
    if (!this.isTravelInvolved) {
      this.addRRForm.controls['travelValue'].reset()
    }
  }

  onSelectBillingType() {
    this.addRRForm.value.billingType = Boolean(JSON.parse(this.addRRForm.value.billingType))
    this.isBillable = this.addRRForm.value.billingType;
    this.isBillable ? this.addRRForm.controls['billingFrequency'].enable() : this.addRRForm.controls['billingFrequency'].disable();
    this.isBillable ? this.addRRForm.controls['billingCurrency'].enable() : this.addRRForm.controls['billingCurrency'].disable();
    this.isBillable ? this.addRRForm.controls['billRate'].enable() : this.addRRForm.controls['billRate'].disable();
    if (!this.isBillable) {
      this.addRRForm.controls['billingFrequency'].reset();
      this.addRRForm.controls['billingCurrency'].reset();
      this.addRRForm.controls['billRate'].reset();
    }
    if (this.resourceRequestDetail?.location === 'INDIA' || this.addRRForm.value.location === 'INDIA') {
      this.addRRForm.controls['workAuthorizationStatus'].disable();
    }
  }

  onSelectDuration(event) {
    this.durationDate = event.target.checked;
    this.projectEndDate = false;
  }

  onSelectEndDate(event) {
    this.durationDate = false;
    this.projectEndDate = event.target.checked;
    this.addRRForm.controls['roleDuration'].reset();
  }

  addSkill() {
    if (this.skillsList.length) {
      this.skillsList.push({
        Id: this.skillsList.length + 1,
        Name: 'Skill ' + (this.skillsList.length + 1),
        selectedSkill: null,
        selectedOption: null
      });
    }
  }

  onSelectAccount(event) {
    this.addRRForm.controls['projectName'].reset(0);
    this.getProjectListByAcc(event.target.value);
  }

  onSelectItem(event, index) {
    const data = event.target.value;
    if (data) {
      const selectedObject = this.addRRForm.controls.preferredSkills.value.find(list => list.skillName === data);
      const isAvailable: [] = this.checkIfItemAdded(selectedObject);
      if (isAvailable?.length && isAvailable.length > 1) {
        this.toastService.showWarning('Selected skill already added', 'Alert');
        this.addRRForm.controls['preferredSkills']['controls'][index].controls.skillName.reset();
        return;
      }
    }
  }

  checkIfItemAdded(selectedObject) {
    if (this.addRRForm.controls.preferredSkills.value?.length) {
      return filter(this.addRRForm.controls.preferredSkills.value, { 'skillName': selectedObject.skillName });
    }
  }

  onSelectDate(event) {
    if (event) {
      this.durationDate = true;
      this.projectEndDate = false;
    }
  }

  trackElement(index: number, element: any) {
    return element ? element.id : null;
  }

  preventKeys(event: any) {
    if (event.keyCode === 69 || event.keyCode === 107 || event.keyCode === 109 || event.keyCode === 189) {
      console.log(event.keyCode);
      event.stopPropagation();
      return false;
    }
  }

  checkValueSelected() {
    for (const field in this.addRRForm.controls) {
      const validator = this.addRRForm.get(field).validator && this.addRRForm.get(field).validator({} as AbstractControl);
      if (validator?.required && (this.addRRForm.controls[field].value === 'null' || this.addRRForm.controls[field].value === 'Select' || this.addRRForm.controls[field].value === '0')) {
        console.log(field);
        if (field === 'serviceType' || field === 'coe' || field === 'proficiency' || field === 'accountName' || field === 'projectName') {
          this.addRRForm.controls[field].patchValue(0);
        } else {
          this.addRRForm.controls[field].reset();
        }
        this.addRRForm.controls[field].setErrors({ 'invalid': true });
        this.addRRForm.setErrors({ 'invalid': true });
        // return;
      }
    }
  }

}
