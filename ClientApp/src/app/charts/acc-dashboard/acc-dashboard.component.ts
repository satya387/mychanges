import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ChartsService } from '../charts.service';
import * as XLSX from 'xlsx';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface BuItem {
  id: number;
  bu: string;
}

export interface AccountList {
  mastCustID: number;
  mastcustName: string;
}

export interface ProjectList {
  mastCustID: number;
  mastcustName: string;
  projID: number;
  projName: string;
}

export interface PracticeAreaList {
  practiceAreaID: number;
  practiceArea: string;
}
@Component({
  selector: 'app-acc-dashboard',
  templateUrl: './acc-dashboard.component.html',
  styleUrls: ['./acc-dashboard.component.scss']
})

export class AccDashboardComponent implements OnInit, AfterViewInit {
  graphsToLoad = 2; // Initially load the first two graphs
  public selectedOptionBU: string = '-1';
  public selectedOptionAccount: string = '-1';
  public selectedOptionLocation: string = '-1';
  public selectedOptionYear: number = new Date().getFullYear() - 1;
  public selectedMacadamianStatus: string = 'Yes';
  public selectedRevenueOnHoldStatus: string = 'No';
  public isRevenueOnHold: boolean = false;
  public isMacadamian: boolean = false;
  public revenueData: any;
  public headCountData: any;
  public headCountPie: any;
  public directMarginData: any;
  public sharedCostsData: any;
  public ebitdaData: any;
  public buList: BuItem[];
  public accountList: AccountList[];
  public projectList: ProjectList[];  
  public filteredProjectAccountsList: ProjectList[];  
  public practiceAreaList: PracticeAreaList[];
  public empEmidsId: string = '-1';
  public IsEbitdaVisible: any = false;
  public yearOptions: { value: number; label: string }[] = [];
  public utilizationData: any;
  public accRisksData: any;
  public bookToBillData: any;
  public accMarginData: any;
  public selectedOptionLocationForBarGraph: string = '-1';
  public selectedOptionLocationForBarGraphOnShore: string = '1';
  public selectedOptionLocationForBarGraphOffShore: string = '2';
  public selectedOptionLocationForBarGraphNearShore: string = '3';
  public lastSelectedBu: string = '';
  public lastSelectedAccount: string = '';
  public lastSelectedProject: string = '';
  public lastSelectedProjectID: any;
  public lastSelectedPracticeArea: string = '';  
  public lastSelectedPracticeAreaID: any; 
  public lastSelectedAccountID: any;
  public lastSelectedLocation: string = '';
  public lastSelectedYear: string = '';
  public lastSelectedStudio: string = '';
  public inputBlurredByDropdown: boolean = false;
  public bu: BuItem;
  isBuInputFocused: boolean = false;
  isAccountInputFocused: boolean = false;
  isProjectInputFocused: boolean = false;
  isPracticeInputFocused: boolean = false;
  public quaterly: boolean = false;
  isEbitdaAddBack: boolean = false;

  Quarterlycontrol = new FormControl();
  buFormControl = new FormControl();
  filteredBuList: Observable<BuItem[]>;
  accountFormControl = new FormControl();
  filteredAccountList: Observable<AccountList[]>;
  filteredProjectList: Observable<ProjectList[]>;
  filteredPracticeAreaList: Observable<PracticeAreaList[]>;
  locationFormControl = new FormControl();
  projectFormControl = new FormControl();
  practiceAreaFormControl = new FormControl();
  studioFormControl = new FormControl();
  yearFormControl = new FormControl();
  filteredYearOptions: Observable<{ value: number; label: string }[]>;
  onFilterSearch: boolean  = false;
  @ViewChild('buInput') buInput!: ElementRef;
  @ViewChild('locationInput') locationInput!: ElementRef;
  @ViewChild('accountInput') accountInput!: ElementRef;
  @ViewChild('yearInput') yearInput!: ElementRef;
  @ViewChild('projectInput') projectInput!: ElementRef;
  @ViewChild('practiceAreaInput') practiceAreaInput!: ElementRef;
  @ViewChild('studioInput') studioInput!: ElementRef;

  constructor(private elementRef: ElementRef, private chartsService: ChartsService) { }

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = '#f5f5f5';
  }

  ngOnInit(): void {
    this.onFilterSearch = false;
    if (JSON.parse(sessionStorage.getItem('userDetail')).Roles.includes('delivery_dashboard_admin')) {
      this.empEmidsId = '-1';
      this.IsEbitdaVisible = true;
    }
    else{
      this.empEmidsId = JSON.parse(sessionStorage.getItem('userDetail')).EmployeeId;
      this.IsEbitdaVisible = false;
    }
    //replace this emp id with next line
    //JSON.parse(sessionStorage.getItem('userDetail')).EmployeeId;

    // this.chartsService.IsEBITDAVisible(JSON.parse(sessionStorage.getItem('userDetail')).EmployeeId).subscribe((data: any) => {
    //   this.IsEbitdaVisible = data;
    //   // console.log("Ebitda- ",this.IsEbitdaVisible);
    // });

    this.chartsService.getBuList(this.empEmidsId).subscribe((data: any) => {
      this.buList = data;
      this.buFormControl.setValue('All');
      this.filteredBuList = this.buFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._buFilter(value))
      );
    });


    this.chartsService.getAccountList(this.empEmidsId).subscribe((data: any) => {
      this.accountList = data;
      this.accountFormControl.setValue('All');
      this.filteredAccountList = this.accountFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._accountFilter(value))
      );
    });

    this.chartsService.getProjectList(this.empEmidsId, -1).subscribe((data: any) => {
      this.projectList = data;
      this.projectFormControl.setValue('All');
      this.filteredProjectList = this.projectFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._projectFilter(value))
      );
    });

    this.chartsService.getPracticeAreaList(this.empEmidsId).subscribe((data: any) => {
      this.practiceAreaList = data;
      this.practiceAreaFormControl.setValue('All');
      this.filteredPracticeAreaList = this.practiceAreaFormControl.valueChanges.pipe(
        startWith(''),
        map(value => this._practiceAreaFilter(value))
      );
    });
    this.locationFormControl.setValue('All');
    this.studioFormControl.setValue('All');
    const currentYear = new Date().getFullYear();
    this.yearOptions.push({ value: currentYear, label: currentYear.toString() });

    this.yearOptions.push({ value: currentYear - 1, label: (currentYear - 1).toString() });

    this.yearFormControl.setValue(currentYear);
    this.filteredYearOptions = this.yearFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._yearFilter(value))
    );
    if(this.graphsToLoad >= 2){
      this.renderGraph(2);
    //   this.chartsService.getRevenueData(this.empEmidsId).subscribe((data: any) => this.revenueData = data);
    // this.chartsService.getSharedCostData(this.empEmidsId).subscribe(
    //   (data: any) => this.sharedCostsData = data);
    }
    // else{
    //   this.chartsService.getHeadCountData(this.empEmidsId).subscribe((data: any) => {
    //     this.headCountData = data;
    //     this.headCountPie = this.headCountData.locationBasedHeadCounts;
    //   });
    //   this.chartsService.getDirectMarginData(this.empEmidsId).subscribe(
    //     (data: any) => this.directMarginData = data);
    //   this.chartsService.getAccountMarginData(this.empEmidsId).subscribe(
    //     (data: any) => this.accMarginData = data);
    //   this.chartsService.getUtilizationData(this.empEmidsId).subscribe((data: any) => this.utilizationData = data);
    //   this.chartsService.getAccountRisksData(this.empEmidsId).subscribe((data: any) => this.accRisksData = data.accountRisks);
    //   this.chartsService.getBookToBillData(this.empEmidsId).subscribe((data: any) => this.bookToBillData = data.bookToBill);
      
    //   this.chartsService.getEbitdaData(this.empEmidsId).subscribe(
    //     (data: any) => this.ebitdaData = data);
    // }
    
    
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {

    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load the next two graphs when the user scrolls to 75% of the page height
    if (scrollPosition > documentHeight * 0.85 && this.graphsToLoad < 6) {
      // console.log("Scrolled bottom, graphsToLoad",this.graphsToLoad);
      this.graphsToLoad = 6; // Load all graphs
      // this.renderGraph(5);
      this.renderGraph(6);
    } else if (scrollPosition > documentHeight * 0.5 && this.graphsToLoad < 4) {
      // console.log("Scrolled middle, graphsToLoad",this.graphsToLoad);
      this.graphsToLoad = 4; // Load the next two graphs
      // this.renderGraph(3);
      this.renderGraph(4);
    }
  }
  renderGraph(graphNumber: number) {
    if(this.onFilterSearch){
    this.quaterly = this.Quarterlycontrol.value;
    this.bu = this.buList.filter(bu => bu.bu == this.buFormControl.value)[0];
    const account: AccountList = this.accountList.filter(acc => acc.mastcustName == this.accountFormControl.value)[0];
    const project: ProjectList = this.projectList.filter(proj => proj.projName == this.projectFormControl.value)[0];
    const practiceArea: PracticeAreaList = this.practiceAreaList.filter(prac => prac.practiceArea == this.practiceAreaFormControl.value)[0];
    const selectedLocation = this.locationFormControl.value;
    const selectedStudio = this.studioFormControl.value;
    const selectedBU = this.buFormControl.value;
    this.lastSelectedBu = this.bu?.bu;
    this.lastSelectedAccount = account?.mastcustName;
    this.lastSelectedAccountID = account?.mastCustID;
    this.lastSelectedProject = project?.projName;    
    this.lastSelectedProjectID = project?.projID;
    this.lastSelectedPracticeArea = practiceArea?.practiceArea;
    this.lastSelectedPracticeAreaID = practiceArea?.practiceAreaID;
    this.lastSelectedLocation = selectedLocation;
    this.lastSelectedYear = this.yearFormControl.value;
    this.lastSelectedStudio = selectedStudio;
    this.inputBlurredByDropdown = true;

    let SelectedProjectValue;
    if (this.lastSelectedProject == 'All')
      SelectedProjectValue = '-1';
    else
      SelectedProjectValue = project?.projID;

    let SelectedPracticeAreaValue;
    if (this.lastSelectedPracticeArea == 'All')
      SelectedPracticeAreaValue = '-1';
    else
      SelectedPracticeAreaValue = practiceArea?.practiceAreaID;

    let SelectedBuValue;
    if (selectedBU == 'All')
      SelectedBuValue = '-1';
    else
      SelectedBuValue = selectedStudio;

    let selectedStudioValue;

    if (selectedStudio == 'All')
      selectedStudioValue = '-1';
    else
      selectedStudioValue = selectedStudio;

    let selectedLocationValue;
    switch (selectedLocation) {
      case 'All':
        selectedLocationValue = '-1';
        break;
      case 'On Shore':
        selectedLocationValue = '2';
        break;
      case 'Off Shore':
        selectedLocationValue = '1';
        break;
      case 'Near Shore':
        selectedLocationValue = '3';
        break;
      default:
        selectedLocationValue = null;
    }

    if(graphNumber == 2){
        this.chartsService.getRevenueData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.revenueData = data);
        this.chartsService.getSharedCostData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
          (data: any) => this.sharedCostsData = data);
    }
    if(graphNumber == 4){
        this.chartsService.getEbitdaData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly,this.isEbitdaAddBack).subscribe(
          (data: any) => this.ebitdaData = data);
        this.chartsService.getDirectMarginData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
          (data: any) => this.directMarginData = data);
        this.chartsService.getAccountMarginData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
          (data: any) => this.accMarginData = data);
    }
    if(graphNumber == 6){
        this.chartsService.getHeadCountData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue,SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => {
          this.headCountData = data;
          this.headCountPie = this.headCountData.locationBasedHeadCounts;
        });
        this.selectedOptionLocationForBarGraph = selectedLocationValue;
        this.chartsService.getUtilizationData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.utilizationData = data);
        //this.chartsService.getAccountRisksData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, '', this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.accRisksData = data.accountRisks);
        //this.chartsService.getBookToBillData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, '', this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.bookToBillData = data.bookToBill);
    }
  }
  else{
    if(graphNumber == 2){
        this.chartsService.getRevenueData(this.empEmidsId).subscribe((data: any) => this.revenueData = data);
        this.chartsService.getSharedCostData(this.empEmidsId).subscribe(
        (data: any) => this.sharedCostsData = data);
    }
    if(graphNumber == 4){
        this.chartsService.getEbitdaData(this.empEmidsId).subscribe(
          (data: any) => this.ebitdaData = data);
        this.chartsService.getDirectMarginData(this.empEmidsId).subscribe(
          (data: any) => this.directMarginData = data);
        this.chartsService.getAccountMarginData(this.empEmidsId).subscribe(
          (data: any) => this.accMarginData = data);
    }
    if(graphNumber == 6){
        this.chartsService.getHeadCountData(this.empEmidsId).subscribe((data: any) => {
          this.headCountData = data;
          this.headCountPie = this.headCountData.locationBasedHeadCounts;
        });
        this.chartsService.getUtilizationData(this.empEmidsId).subscribe((data: any) => this.utilizationData = data);
      //this.chartsService.getAccountRisksData(this.empEmidsId).subscribe((data: any) => this.accRisksData = data.accountRisks);
      //this.chartsService.getBookToBillData(this.empEmidsId).subscribe((data: any) => this.bookToBillData = data.bookToBill);
    }
  }
  }

  onCheckboxChange(state: boolean): void {
    // debugger;
    this.isEbitdaAddBack = state;
    let SelectedProjectValue;
    if (this.lastSelectedProject == 'All')
      SelectedProjectValue = '-1';
    else
      SelectedProjectValue = this.lastSelectedProjectID;

    let SelectedPracticeAreaValue;
    if (this.lastSelectedPracticeArea == 'All')
      SelectedPracticeAreaValue = '-1';
    else
      SelectedPracticeAreaValue = this.lastSelectedPracticeAreaID;
    let selectedLocationValue;
    switch (this.lastSelectedLocation) {
      case 'All':
        selectedLocationValue = '-1';
        break;
      case 'On Shore':
        selectedLocationValue = '2';
        break;
      case 'Off Shore':
        selectedLocationValue = '1';
        break;
      case 'Near Shore':
        selectedLocationValue = '3';
        break;
      default:
        selectedLocationValue = null;
    }
    this.chartsService.getEbitdaData(this.empEmidsId, this.bu?.id, this.lastSelectedAccountID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, '-1', SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly,this.isEbitdaAddBack).subscribe(
      (data: any) => this.ebitdaData = data);
  }
  private _buFilter(value: string): any {
    const filterValue = value?.toLowerCase();
    if (!filterValue || filterValue === 'all') {
      return [{ id: -1, bu: 'All' }, ...this.buList];
    } else {
      return [{ id: -1, bu: 'All' }, ...this.buList.filter(bu => bu.bu?.toLowerCase().includes(filterValue))];
    }
  }

  triggerClick(type: any): void {
    if (type == 'BU') {
      // this.buInput.nativeElement.focus();
      setTimeout(() => {
        this.buInput.nativeElement.blur();
      }, 300);
    }
    if(type == 'Location'){
      // this.locationInput.nativeElement.focus();
      setTimeout(() => {
        this.locationInput.nativeElement.blur();
      }, 300);
    }
    if(type == 'Account'){
      // this.accountInput.nativeElement.focus();
      setTimeout(() => {
        this.accountInput.nativeElement.blur();
      }, 300);
    }
    
    if(type == 'Project'){
      // this.projectInput.nativeElement.focus();
      setTimeout(() => {
        this.projectInput.nativeElement.blur();
      }, 300);
    }
    
    if(type == 'PracticeArea'){
      // this.practiceAreaInput.nativeElement.focus();
      setTimeout(() => {
        this.practiceAreaInput.nativeElement.blur();
      }, 300);
    }
    if(type == 'Year'){
      // this.yearInput.nativeElement.focus();
      setTimeout(() => {
        this.yearInput.nativeElement.blur();
      }, 300);
    }
    if(type == 'Studio'){
      //this.studioInput.nativeElement.focus();
      setTimeout(() => {
        this.studioInput.nativeElement.blur();
      }, 300);
    }

  }

  onBuInputBlur() {
    this.isBuInputFocused = false;
    setTimeout(() => {
      if (!this.buFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedBu ? this.buFormControl.setValue(this.lastSelectedBu) : this.buFormControl.setValue('All');
      }
      else if(this.lastSelectedBu){
        this.buFormControl.setValue(this.lastSelectedBu);
      }

      this.inputBlurredByDropdown = false;
    }, 300);
  }

  onBuInputFocus() {
    // this.buFormControl.setValue('');
    this.isBuInputFocused = true;
   // this.filteredBuList = of([{ id: -1, bu: 'All' }, ...this.buList])
  }

  onAccountInputFocus() {
    // this.accountFormControl.setValue('');
    this.isAccountInputFocused = true;
    // this.filteredAccountList = of([{ mastCustID: -1, mastcustName: 'All' }, ...this.accountList]);
  }

  onProjectInputFocus() {
    // this.accountFormControl.setValue('');
    this.isProjectInputFocused = true;
    //this.filteredProjectList = of([{ mastCustID: -1, mastcustName: 'All', projID: -1, projName: 'All' }, ...this.filteredProjectAccountsList]);
  }

  onPracticeAreaInputFocus() {
    // this.accountFormControl.setValue('');
    this.isPracticeInputFocused = true;
    // this.filteredPracticeAreaList = of([{ practiceAreaID: -1, practiceArea: 'All' }, ...this.practiceAreaList]);
  }

  onYearInputFocus() {
    // this.yearFormControl.setValue('');
    this.filteredYearOptions = of(this.yearOptions);
  }

  onAccountInputBlur() {
    this.isAccountInputFocused = false;
    setTimeout(() => {
      if (!this.accountFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedAccount ? this.accountFormControl.setValue(this.lastSelectedAccount) : this.accountFormControl.setValue('All');
      }
      else if(this.lastSelectedAccount){
        this.accountFormControl.setValue(this.lastSelectedAccount);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  }


  onProjectInputBlur() {
    this.isProjectInputFocused = false;
    setTimeout(() => {
      if (!this.projectFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedProject ? this.projectFormControl.setValue(this.lastSelectedProject) : this.projectFormControl.setValue('All');
      }
      else if(this.lastSelectedProject){
        this.projectFormControl.setValue(this.lastSelectedProject);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  } 

  onPracticeAreaInputBlur() {
    this.isPracticeInputFocused = false;
    setTimeout(() => {
      if (!this.practiceAreaFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedPracticeArea ? this.practiceAreaFormControl.setValue(this.lastSelectedPracticeArea) : this.practiceAreaFormControl.setValue('All');
      }
      else if(this.lastSelectedPracticeArea){
        this.practiceAreaFormControl.setValue(this.lastSelectedPracticeArea);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  }
  onLocationInputBlur() {
    setTimeout(() => {
      if (!this.locationFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedLocation ? this.locationFormControl.setValue(this.lastSelectedLocation) : this.locationFormControl.setValue('All');
      }
      else if(this.lastSelectedLocation){
        this.locationFormControl.setValue(this.lastSelectedLocation);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  }

  onYearInputBlur() {
    setTimeout(() => {
      if (!this.yearFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedYear ? this.yearFormControl.setValue(this.lastSelectedYear) : this.yearFormControl.setValue(new Date().getFullYear());
      }
      else if(this.lastSelectedYear){
        this.yearFormControl.setValue(this.lastSelectedYear);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  }

  onStudioInputBlur() {
    setTimeout(() => {
      if (!this.studioFormControl.value && !this.inputBlurredByDropdown) {
        this.lastSelectedStudio ? this.studioFormControl.setValue(this.lastSelectedStudio) : this.studioFormControl.setValue('All');
      }
      else if(this.lastSelectedStudio){
        this.studioFormControl.setValue(this.lastSelectedStudio);
      }
      this.inputBlurredByDropdown = false;
    }, 300);
  }

  private _accountFilter(value: string): any {
    const filterValue = value?.toLowerCase();
    if (!filterValue || filterValue === 'all') {
      return [{ mastCustID: -1, mastcustName: 'All' }, ...this.accountList];
    } else {
      return [{ mastCustID: -1, mastcustName: 'All' }, ...this.accountList.filter(acc => acc.mastcustName?.toLowerCase().includes(filterValue))];
    }
  }

  // private _projectFilter(value: string): any {
  //   console.log(value);
  //   const filterValue = value?.toLowerCase();
  //   if (!filterValue || filterValue === 'all') {
  //     return [{ mastCustID: -1, mastcustName: 'All', projID: -1, projName: 'All' }, ...this.projectList];
  //   } else {
  //     return [{ mastCustID: -1, mastcustName: 'All', projID: -1, projName: 'All' }, ...this.projectList.filter(proj => proj.projName?.toLowerCase().includes(filterValue))];
  //   }
  // }

  private _projectFilter(value: string): any {
    const filterValue = value?.toLowerCase();
    // Filter projects based on the selected account
    const selectedAccount = this.lastSelectedAccountID;
    if(this.lastSelectedAccountID == undefined){      
      //console.log("filterValue", this.lastSelectedAccountID);
      this.filteredProjectAccountsList = this.projectList;
    }
    else{
    this.filteredProjectAccountsList = this.projectList.filter(
      proj => proj.mastCustID === this.lastSelectedAccountID
    );
    }
 
    // console.log("filteredProjectsForAccount",filteredProjectsForAccount );
    // Further filter based on project name
    if (!filterValue || filterValue === 'all') {
      return [{ mastCustID: -1, projID: -1, projName: 'All' }, ...this.filteredProjectAccountsList];
    } else {
      // console.log([{ mastCustID: -1, projID: -1, projName: 'All' }, ...filteredProjectsForAccount.filter(proj => proj.projName?.toLowerCase().includes(filterValue))]);
      return [{ mastCustID: -1, projID: -1, projName: 'All' }, ...this.filteredProjectAccountsList.filter(proj => proj.projName?.toLowerCase().includes(filterValue))];
    }
  }
  
  private _practiceAreaFilter(value: string): any {
    const filterValue = value?.toLowerCase();
    if (!filterValue || filterValue === 'all') {
      return [{ practiceAreaID: -1, practiceArea: 'All' }, ...this.practiceAreaList];
    } else {
      return [{ practiceAreaID: -1, practiceArea: 'All' }, ...this.practiceAreaList.filter(prac => prac.practiceArea?.toLowerCase().includes(filterValue))];
    }
  }

  private _yearFilter(value: any): { value: number; label: string }[] {
    const filterValue = value;
    return this.yearOptions.filter(year => year.label.includes(filterValue));
  }

  onSelectionChange(event?) {
    this.quaterly = this.Quarterlycontrol.value;
    // const inputElement = event.target as HTMLInputElement;
    // if (inputElement) {
    //   const value = inputElement.type === 'checkbox' ? (inputElement.checked ? 1 : 0) : inputElement.value;
    //   this.form.controls[controlName].setValue(value);
    // } else {
    //   console.error('Input element is undefined');
    // }
  

    // console.log('Quaterly selected', this.quaterly);
    this.bu = this.buList.filter(bu => bu.bu == this.buFormControl.value)[0];
    const account: AccountList = this.accountList.filter(acc => acc.mastcustName == this.accountFormControl.value)[0];
    const project: ProjectList = this.projectList.filter(proj => proj.projName == this.projectFormControl.value)[0];
    const practiceArea: PracticeAreaList = this.practiceAreaList.filter(prac => prac.practiceArea == this.practiceAreaFormControl.value)[0];
    const selectedLocation = this.locationFormControl.value;
    const selectedStudio = this.studioFormControl.value;
    const selectedBU = this.buFormControl.value;
    this.lastSelectedBu = this.bu?.bu;
    this.lastSelectedAccount = account?.mastcustName;
    this.lastSelectedAccountID = account?.mastCustID;
    this.lastSelectedProject = project?.projName;    
    this.lastSelectedProjectID = project?.projID;
    this.lastSelectedPracticeArea = practiceArea?.practiceArea;
    this.lastSelectedPracticeAreaID = practiceArea?.practiceAreaID;
    this.lastSelectedLocation = selectedLocation;
    this.lastSelectedYear = this.yearFormControl.value;
    this.lastSelectedStudio = selectedStudio;
    this.inputBlurredByDropdown = true;

    if(event == 'Account'){
      //console.log(this.filteredProjectList);
      this.filteredProjectList = this.accountFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._projectFilter(this.lastSelectedAccount)
      )
      );
      if (this.lastSelectedAccountID === project?.mastCustID) {
        if(this.lastSelectedProject){
           this.projectFormControl.setValue(this.lastSelectedProject)
          }
        else{ 
          this.projectFormControl.setValue('All');
          this.lastSelectedProject = 'All';
        }
      }
      else{
        this.projectFormControl.setValue('All');
        this.lastSelectedProject = 'All';
      }
      //console.log(this.filteredProjectList);
    }
    setTimeout(() => {
      this.triggerClick(event);
    }, 100);

    let SelectedProjectValue;
    if (this.lastSelectedProject == 'All')
      SelectedProjectValue = '-1';
    else
      SelectedProjectValue = project?.projID;

    let SelectedPracticeAreaValue;
    if (this.lastSelectedPracticeArea == 'All')
      SelectedPracticeAreaValue = '-1';
    else
      SelectedPracticeAreaValue = practiceArea?.practiceAreaID;

    let SelectedBuValue;
    if (selectedBU == 'All')
      SelectedBuValue = '-1';
    else
      SelectedBuValue = selectedStudio;

    let selectedStudioValue;

    if (selectedStudio == 'All')
      selectedStudioValue = '-1';
    else
      selectedStudioValue = selectedStudio;

    let selectedLocationValue;
    switch (selectedLocation) {
      case 'All':
        selectedLocationValue = '-1';
        break;
      case 'On Shore':
        selectedLocationValue = '2';
        break;
      case 'Off Shore':
        selectedLocationValue = '1';
        break;
      case 'Near Shore':
        selectedLocationValue = '3';
        break;
      default:
        selectedLocationValue = null;
    }

    if (!this.bu?.id && !account?.mastCustID && !project?.projID && !practiceArea?.practiceAreaID && this.yearFormControl.value === new Date().getFullYear() && selectedLocationValue === '-1' && !this.isMacadamian && !this.isRevenueOnHold && selectedStudioValue == '-1' && this.quaterly === false) {
      this.onFilterSearch = false;
      this.graphsToLoad = 2;
      this.renderGraph(2);
      // this.chartsService.getRevenueData(this.empEmidsId).subscribe((data: any) => this.revenueData = data);
      // this.chartsService.getHeadCountData(this.empEmidsId).subscribe((data: any) => {
      //   this.headCountData = data;
      //   this.headCountPie = this.headCountData.locationBasedHeadCounts;
      // });
      // this.selectedOptionLocationForBarGraph = selectedLocationValue;
      // this.chartsService.getDirectMarginData(this.empEmidsId).subscribe(
      //   (data: any) => this.directMarginData = data);
      // this.chartsService.getAccountMarginData(this.empEmidsId).subscribe(
      //   (data: any) => this.accMarginData = data);
      // this.chartsService.getUtilizationData(this.empEmidsId).subscribe((data: any) => this.utilizationData = data);
      // this.chartsService.getAccountRisksData(this.empEmidsId).subscribe((data: any) => this.accRisksData = data.accountRisks);
      // this.chartsService.getBookToBillData(this.empEmidsId).subscribe((data: any) => this.bookToBillData = data.bookToBill);
      // this.chartsService.getSharedCostData(this.empEmidsId).subscribe(
      //   (data: any) => this.sharedCostsData = data);
      // this.chartsService.getEbitdaData(this.empEmidsId).subscribe(
      // (data: any) => this.ebitdaData = data);  
    }
    else {
      this.onFilterSearch = true;
      this.graphsToLoad = 2;
      this.renderGraph(2);
      // this.chartsService.getRevenueData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.revenueData = data);
      // this.chartsService.getHeadCountData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue,SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => {
      //   this.headCountData = data;
      //   this.headCountPie = this.headCountData.locationBasedHeadCounts;
      // });
      // this.selectedOptionLocationForBarGraph = selectedLocationValue;
      // this.chartsService.getDirectMarginData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
      //   (data: any) => this.directMarginData = data);
      // this.chartsService.getAccountMarginData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
      //   (data: any) => this.accMarginData = data);
      // this.chartsService.getUtilizationData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.utilizationData = data);
      // this.chartsService.getAccountRisksData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, '', this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.accRisksData = data.accountRisks);
      // this.chartsService.getBookToBillData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, '', this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe((data: any) => this.bookToBillData = data.bookToBill);
      // this.chartsService.getSharedCostData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
      //   (data: any) => this.sharedCostsData = data);
      // this.chartsService.getEbitdaData(this.empEmidsId, this.bu?.id, account?.mastCustID, this.yearFormControl.value, selectedLocationValue, this.isMacadamian, this.isRevenueOnHold, selectedStudioValue, SelectedProjectValue,SelectedPracticeAreaValue,this.quaterly).subscribe(
      // (data: any) => this.ebitdaData = data);
    }
  }
  clearBuInput() {
    this.buFormControl.setValue('');
  }

  clearAccountInput() {
    this.accountFormControl.setValue('');
  }
  clearProjectInput() {
    this.projectFormControl.setValue('');
  }
  clearPracticeAreaInput() {
    this.practiceAreaFormControl.setValue('');
  }

  disableInput(event: KeyboardEvent): void {
    event.preventDefault();
  }

  handleLocationClicked(location: string) {
    if (location === 'Onshore') {
      this.selectedOptionLocationForBarGraph = '1';
      this.chartsService.getHeadCountData(this.empEmidsId, this.selectedOptionBU, this.selectedOptionAccount, this.yearFormControl.value, this.selectedOptionLocationForBarGraph, this.isMacadamian, this.isRevenueOnHold).subscribe((data: any) => this.headCountData = data);
    }
    if (location === 'Offshore') {
      this.selectedOptionLocationForBarGraph = '2';
      this.chartsService.getHeadCountData(this.empEmidsId, this.selectedOptionBU, this.selectedOptionAccount, this.yearFormControl.value, this.selectedOptionLocationForBarGraph, this.isMacadamian, this.isRevenueOnHold).subscribe((data: any) => this.headCountData = data);
    }
    if (location === 'Near-shore') {
      this.selectedOptionLocationForBarGraph = '3';
      this.chartsService.getHeadCountData(this.empEmidsId, this.selectedOptionBU, this.selectedOptionAccount, this.yearFormControl.value, this.selectedOptionLocationForBarGraph, this.isMacadamian, this.isRevenueOnHold).subscribe((data: any) => this.headCountData = data);
    }
  }

  downloadExcel(): void {
    // Combine or structure your data as needed
    const combinedData = this.combineData(this.revenueData.revenues, this.accMarginData.accountMargins, this.directMarginData.directMargins, this.utilizationData.utilizations);

    // Convert the data to worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(combinedData);

    // Create a workbook with a single sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'Delivery_Dashboard_Report.xlsx');
  }

  deliveryDashboardExcelDump(){
    this.bu = this.buList.filter(bu => bu.bu == this.buFormControl.value)[0];
    const account: AccountList = this.accountList.filter(acc => acc.mastcustName == this.accountFormControl.value)[0];
    const project: ProjectList = this.projectList.filter(proj => proj.projName == this.projectFormControl.value)[0];
    const practiceArea: PracticeAreaList = this.practiceAreaList.filter(prac => prac.practiceArea == this.practiceAreaFormControl.value)[0];
    const selectedLocation = this.locationFormControl.value;
    const selectedStudio = this.studioFormControl.value;
    const selectedBU = this.buFormControl.value;
    const selectedAccount = this.accountFormControl.value;
    const selectedProject = this.projectFormControl.value;
    const selectedPracticeArea = this.practiceAreaFormControl.value;
    const selectedYear = this.yearFormControl.value;
    let selectedYearValue;
    if (selectedYear == 'LTM') {
      selectedYearValue = -1
    } 
    else {
      selectedYearValue = parseInt(selectedYear, 10)
    }
    let selectedAccountValue;
    if (selectedAccount == 'All')
    selectedAccountValue = '-1';
    else
    selectedAccountValue = account?.mastCustID.toString();
    let selectedProjectValue;
    if (selectedProject == 'All')
    selectedProjectValue = -1;
    else
    selectedProjectValue = project?.projID;
    let selectedPracticeAreaValue;
    if (selectedPracticeArea == 'All')
    selectedPracticeAreaValue = -1;
    else
    selectedPracticeAreaValue = practiceArea?.practiceAreaID;
    let SelectedBuValue;
    if (selectedBU == 'All')
      SelectedBuValue = '-1';
    else
      SelectedBuValue = this.bu?.id.toString();
    let selectedStudioValue;
    if (selectedStudio == 'All')
      selectedStudioValue = '-1';
    else
      selectedStudioValue = selectedStudio;
    
      let selectedLocationValue;
      switch (selectedLocation) {
        case 'All':
          selectedLocationValue = '-1';
          break;
        case 'On Shore':
          selectedLocationValue = '2';
          break;
        case 'Off Shore':
          selectedLocationValue = '1';
          break;
        case 'Near Shore':
          selectedLocationValue = '3';
          break;
        default:
          selectedLocationValue = null;
      }
    const object = {
      Location: selectedLocationValue,
      EmpemidsID: this.empEmidsId,
      Year: selectedYearValue, // this.yearFormControl.value,
      AccountId: selectedAccountValue,
      ProjectId: selectedProjectValue,
      PracticeAreaId: selectedPracticeAreaValue,
      BU: SelectedBuValue,
      Studio: selectedStudioValue,
    }
    // console.log(object);
    this.chartsService.downloadExcelDump(object).subscribe((data: HttpResponse<any>) => {
      if (data.status === 200 || data.status === 202) {
        // console.log(`Got a successfull status code: ${data.status}`);        
        const blob = new Blob([data.body], { type: "application/vnd.ms-excel" });
        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Delivery_Dashboard_Report.xls";
        link.click();    
        link.href = "";
        window.URL.revokeObjectURL(downloadURL);
        // console.log(`This contains body: ${data.body}`);
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


  private combineData(revenueData: any[], accMarginData: any[], directMarginData: any[], utilizationData: any[]): any[] {
    const combinedData = revenueData.map(revenue => {
      const matchingDirectMargin = directMarginData.find(dm => dm.year === revenue.year && dm.monthNames === revenue.monthNames);
      const matchingGrossMargin = accMarginData.find(gm => gm.year === revenue.year && gm.monthNames === revenue.monthNames);
      const matchingUtilization = utilizationData.find(util => util.years === revenue.year && util.monthNames === revenue.monthNames);

      return {
        'Bu': this.buFormControl.value,
        'Location': this.locationFormControl.value,
        'Account': this.accountFormControl.value,
        'Year': revenue ? revenue.year : this.yearFormControl.value,
        'Month': revenue ? revenue.monthNames : null,
        'Revenue Target $': revenue.target,
        'Revenue Actuals $': revenue.actual,
        'Direct Margin Target %': matchingDirectMargin ? matchingDirectMargin.target : null,
        'Direct Margin Actuals %': matchingDirectMargin ? matchingDirectMargin.actual : null,
        'Gross Margin Target %': matchingGrossMargin ? matchingGrossMargin.target : null,
        'Gross Margin Actuals %': matchingGrossMargin ? matchingGrossMargin.actual : null,
        'Utilization %': matchingUtilization ? matchingUtilization.utilization : null,
      };
    });

    return combinedData;
  }
}
