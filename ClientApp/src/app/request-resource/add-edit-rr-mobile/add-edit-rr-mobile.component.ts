import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { filter, map } from 'lodash';

import {
  CONFIRM_VALUES, PLACEMENT_TYPE, CURRENCY_TYPE, BILLING_TYPE, EMPLOYMENT_TYPE, BILLING_FREQUENCY,
  EDUCATION_TYPE, SERVICE_TYPE, AUTHORIZATION_STATUS, PAYMENT_TYPE, SKILLS_LIST
} from 'src/app/common/configuration.settings';
import { ToastService } from 'src/app/common/toast/toast.service';

import { RequestResourceService } from '../request-resource.service';


@Component({
  selector: 'app-add-edit-rr-mobile',
  templateUrl: './add-edit-rr-mobile.component.html',
  styleUrls: ['./add-edit-rr-mobile.component.scss']
})
export class AddEditRrMobileComponent implements OnInit {

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
  showFirstPage: boolean;
  showSecondPage: boolean;
  showThirdPage: boolean;
  showFourthPage: boolean;

  constructor(private requestService: RequestResourceService, private toastService: ToastService, private datepipe: DatePipe,
    private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    this.isBackFillSelected = false;
    this.isBillable = true;
    this.projectEndDate = undefined;
    this.durationDate = undefined;
    this.showFirstPage = true;
    this.showSecondPage = false;
    this.showThirdPage = false;
    this.showFourthPage = false;
  }

  ngOnInit(): void {
    this.formInitialization();
    this.getAllCountry();
    this.getAllTechnologyList();
    this.getAllCOEList();
    this.getAllJobTitleList();
    this.getAllExperienceList();
    this.getAllProficiencyList();
    this.getAllProjectList();
    this.getAllReportingManagerList();
    this.getAllRequesterList();
    this.getAllRolesList();
    this.getAllAccountList();
    this.getAllPreferredSkillsList();
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
      'placement': [data ? data.placement : null, [Validators.required]],
      'backfillFor': [data ? data.backFillFor : null],
      'workLocation': [data ? data.workLocation : null, [Validators.required]],
      'jobTitle': [data ? data.jobTitle : null, [Validators.required]],
      'noOfPosition': [data ? data.noOfPositions : null, [Validators.required]],
      'sowSigned': [data ? data.isSowSigned : null, [Validators.required]],
      'minExperience': [data ? data.minExperience : null, [Validators.required]],
      'budgetedCost': [data ? data.budgetedSoldCost : null],
      'serviceType': [data ? data.serviceType : null, [Validators.required]],
      'coe': [data ? data.coe : null, [Validators.required]],
      'projectName': [data ? data.projectId : null, [Validators.required]],
      'proficiency': [data ? data.proficiency : null, [Validators.required]],
      'employmentType': [data ? data.employmentType : null, [Validators.required]],
      'employmentPayment': [data ? data.employmentPayment : null, [Validators.required]],
      'commitDate': [data ? this.datepipe.transform(data.customerCommitDate, 'dd-MM-YYYY') : null, [Validators.required]],
      'accountName': [data ? data.accountId : null, [Validators.required]],
      'roleDuration': [data ? this.datepipe.transform(data.roleDurationOnProject, 'dd-MM-YYYY') : null],
      'technology': [data ? data.technology : null],
      'rlsCode': [data ? data.rlsCode : null],
      'rolesResponsibilities': [data ? data.roleAndResponsibilities : null, [Validators.required]],
      'roleOverview': [data ? data.roleOverview : null, [Validators.required]],
      'projectOverview': [data ? data.projectOverview : null],
      'comments': [data ? data.comments : null],
      'reportingManager': [data ? data.reportingManager : null],
      'client': [data ? data.interviewClient : null],
      'internalInterviewers': [data ? data.interviewers : null],
      'billingType': [data ? data.isBillable : null],
      'billingFrequency': [data ? data.billFrequency : null],
      'billingCurrency': [data ? data.currency : null],
      'billRate': [data ? data.billRate : null],
      'workAuthorizationStatus': [data ? data.workAuthorizationStatus : null],
      'remoteWork': [data ? data.remoteWorkAvailable : null, [Validators.required]],
      'travelInvolved': [data ? data.travelInvolved : null],
      'travelValue': [data ? data.travelPercentage : null],
      'minimumEducation': [data ? data.minimumEducation : null],
      'preferredSkills': this.formBuilder.array([])
    });
    if (!data) {
      this.addSkillOption(5);
    } else {
      const mustHaveLength = data.musttoHaveSkill ? data.musttoHaveSkill.split(/,/) : '';
      const niceToHaveLength = data.niceToHaveSkills ? data.niceToHaveSkills.split(/,/) : '';
      data.skillArrayLength = mustHaveLength.length + niceToHaveLength.length;
      const mustHaveArray = mustHaveLength.map((item) => {
        const obj = {
          'skill': item,
          'option': 'Must have'
        }
        return obj;
      });
      const niceHaveArray = niceToHaveLength.map((item) => {
        const obj = {
          'skill': item,
          'option': 'Good to have'
        }
        return obj;
      });
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
      skillName: [data ? data.skill : '', Validators.required],
      skillOption: [data ? data.option : '', Validators.required],
    });
  }

  get formData() {
    return <FormArray>this.addRRForm.get('preferredSkills');
  }

  getRRDetail(rrId) {
    this.requestService.getRRById(rrId).subscribe((response: any) => {
      if (response) {
        this.resourceRequestDetail = response;
        this.getAllWorkLocationList(this.resourceRequestDetail.location);
        this.formInitialization(this.resourceRequestDetail);
        this.addRRForm.controls.workLocation.patchValue(this.resourceRequestDetail.workLocation);
        this.projectEndDate = this.resourceRequestDetail.isProjectEndDate;
        this.isBillable = this.resourceRequestDetail.isBillable;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
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

  getAllReportingManagerList() {
    this.requestService.getReportingManagerList().subscribe((response: any) => {
      if (response) {
        this.reportingManagerList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getAllRequesterList() {
    this.requestService.getRequesterList().subscribe((response: any) => {
      if (response) {
        this.requesterList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

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
    this.getAllWorkLocationList(countryName);
  }

  generateRequestBody() {
    const object = {
      "NoOfPositions": parseInt(this.addRRForm.value.noOfPosition),
      "RROpportunityId": this.addRRForm.value.opportunityID,
      "MusttoHaveSkill": this.mustHaveSkills,
      "NiceToHaveSkills": this.goodToHaveSkills,
      "AccountId": parseInt(this.addRRForm.value.accountName),
      "Comments": this.addRRForm.value.comments || '',
      "TravelInvolved": Boolean(JSON.parse(this.addRRForm.value.travelInvolved)),
      "BackFillFor": this.addRRForm.value.backfillFor || '',
      "BillFrequency": this.addRRForm.value.billingFrequency,
      "Currency": this.addRRForm.value.billingCurrency,
      "IsBillable": Boolean(JSON.parse(this.addRRForm.value.billingType)),
      "COE": parseInt(this.addRRForm.value.coe),
      "CustomerCommitDate": this.datepipe.transform(this.addRRForm.value.commitDate, 'YYYY-MM-dd') || null,
      "EmploymentPayment": this.addRRForm.value.employmentPayment,
      "BudgetedSoldCost": this.addRRForm.value.budgetedCost || 0,
      "EmploymentType": this.addRRForm.value.employmentType,
      "TravelPercentage": this.addRRForm.value.travelValue || 0,
      "JobTitle": this.addRRForm.value.jobTitle,
      "Location": this.addRRForm.value.location,
      "MinExperience": this.addRRForm.value.minExperience,
      "IsProjectEndDate": this.projectEndDate,
      "PLACEMENT": this.addRRForm.value.placement,
      "PROFICIENCY": parseInt(this.addRRForm.value.proficiency),
      "PROJECTID": parseInt(this.addRRForm.value.projectName),
      "PROJECTOVERVIEW": this.addRRForm.value.projectOverview || '',
      "INTERVIEWERS": this.addRRForm.value.internalInterviewers || '',
      "REMOTEWORKAVAILABLE": Boolean(JSON.parse(this.addRRForm.value.remoteWork)),
      "REPORTINGMANAGER": this.addRRForm.value.reportingManager || '',
      "REQUESTER": this.addRRForm.value.requester,
      "RLSCODE": this.addRRForm.value.rlsCode || '',
      "ROLE": this.addRRForm.value.role,
      "ROLEANDRESPONSIBILITIES": this.addRRForm.value.rolesResponsibilities,
      "ROLEDURATIONONPROJECT": this.datepipe.transform(this.addRRForm.value.roleDuration, 'YYYY-MM-dd') || null,
      "ROLEOVERVIEW": this.addRRForm.value.roleOverview,
      "SERVICETYPE": parseInt(this.addRRForm.value.serviceType),
      "ISSOWSIGNED": Boolean(JSON.parse(this.addRRForm.value.sowSigned)),
      "TECHNOLOGY": this.addRRForm.value.technology || '',
      "WORKAUTHORIZATIONSTATUS": this.addRRForm.value.workAuthorizationStatus,
      "WORKLOCATION": this.addRRForm.value.workLocation,
      "interviewClient": this.addRRForm.value.client
    }
    return object;
  }

  modifyPreferredSkills() {
    if (this.addRRForm.controls.preferredSkills.value) {
      this.mustHaveSkills = map(filter(this.addRRForm.controls.preferredSkills.value, { skillOption: "Must have" }), 'skillName').toString()
      this.goodToHaveSkills = map(filter(this.addRRForm.controls.preferredSkills.value, { skillOption: "Good to have" }), 'skillName').toString()
    }
  }

  onSubmitRRForm() {
    if (!this.addRRForm.valid) {
      this.toastService.showWarning('Please enter all mandatory fields and continue!', 'Alert');
      return;
    } else {
      this.modifyPreferredSkills();
      const requestBody = this.generateRequestBody();
      requestBody['Id'] = this.isAddRR === 'true' ? 0 : this.resourceRequestId;
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
  }

  onSelectPlacement(event) {
    const placeValue = event.target.checked;
    this.isBackFillSelected = this.addRRForm.value.placement !== 'Backfill' ? true : false;
  }

  onSelectBillingType(event) {
    this.addRRForm.value.billingType = Boolean(JSON.parse(this.addRRForm.value.billingType))
    this.isBillable = this.addRRForm.value.billingType;
  }

  onSelectDuration(event) {
    this.durationDate = event.target.checked;
    this.projectEndDate = false;
  }

  onSelectEndDate(event) {
    this.durationDate = false;
    this.projectEndDate = event.target.checked;
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

  gotoNextPage(index) {
    switch (index) {
      case 1:
        this.showFirstPage = false;
        this.showSecondPage = true;
        break;
      case 2:
        this.showFirstPage = false;
        this.showSecondPage = false;
        this.showThirdPage = true;
        break;
      case 3:
        this.showFirstPage = false;
        this.showSecondPage = false;
        this.showThirdPage = false;
        this.showFourthPage = true;
        break;
      default:
        break;
    }
  }

}
