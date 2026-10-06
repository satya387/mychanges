import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { CustomerSatisfactionScoreService } from '../customer-satisfaction-score.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { DatePipe } from '@angular/common';
import { DateAdapter } from '@angular/material/core';
import { FormControl } from '@angular/forms'; // If using moment.js
import {  Router } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { Inject, Input } from '@angular/core';
import { ExcelService } from '../Excel-csat-download';

@Component({
  selector: 'customer-satisfaction-score-download-template',
  templateUrl: './download-template.component.html',
  styleUrls: ['./download-template.component.scss'],
})

export class DownloadTemplateComponent implements OnInit {

    downloadTemplateForm: FormGroup;
     cycleName: any;
     viewData:any;
     formSubmitted: boolean = false;
  
  @Input() cycleData: any;
  constructor(public dialogRef: MatDialogRef<DownloadTemplateComponent>, private formBuilder: FormBuilder, private customerSatisfactionScoreService: CustomerSatisfactionScoreService,
    private toastService: ToastService, private dateAdapter: DateAdapter<Date>, private router: Router, private datepipe: DatePipe, @Inject(MAT_DIALOG_DATA) public cData: any,
    private excelservice: ExcelService
  ) {
    this.cycleData = cData.CycleData.map(item => {
      return {
        id: item.id,
        cycleName: item.cycleName
      };
    });
  }
  accountName = new FormControl();
  ngOnInit(): void {
    this.downloadTemplateForm = this.formBuilder.group({
      cycleName: [null, Validators.required],
    });
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
  onSelect(event: any): void {
    this.cycleName = event.target.value;
  }
  
  // Modify onDownloadTemplate method to handle form submission
onDownloadTemplate(): void {
  this.formSubmitted = true;
  if (this.downloadTemplateForm.valid) {
      this.GetDumpDetails();
  }
}
  

  GetDumpDetails(): void {
    try {
      // Subscribe to the observable returned by your API service to get the data
      const userData = JSON.parse(sessionStorage.getItem('userDetail'));
       const empEmidsId = userData.EmployeeId;
       const cycle = this.cycleName;
      this.customerSatisfactionScoreService.GetTemplateDetails(empEmidsId, cycle).subscribe((TemplateList: any) => {
        // Convert the data to worksheet
        const Data = TemplateList.map(data => {
          return {
            'Cycle': this.cycleName,
            'BU': data.buName,
            'Account Name': data.accountName,
            'Program / Project Name (multiple project selection)': data.projectName,
            'Client Respondent': data.clientRespondent,
            'Client Respondent Email': data.clientRespondentEmail,
            'Management Level (CEO/Senior/Operational)': data.managementLevel,
            'Managing Partner': data.buHead,
            'Client Partner / Account Manager': data.accountManager,
            'Delivery Head': data.deliveryHead,
            'Delivery Manager': data.deliveryManager,
            'Project Manager': data.projectManagerName,
            'Studio Leader': data.studioLeader,
            'Studio': data.studio,
            'Sub Studio': data.subStudio,
            'Project Type (A/B/C)': data.projectType,
            'Engagement Type (Solution Based/IEP/ICP/Capacity Infusion)': data.engagementType,
            'Focus Ac (Y/N)': data.focusAc,
            'NPS Score (Numeric)': '',
            'NPS Category (Text)': '',
            'Expectation 1 (Numeric)': '',
            'Exp 1 rating (Text)': '',
            'Expectation 2 (Numeric)': '',
            'Exp 2 rating (Text)': '',
            'Expectation 3 (Numeric)': '',
            'Exp 3 rating (Text)': '',
            'You are very satisfied with your experience with Emids (Numeric)': '',
            'You will definitely choose Emids for your future requirements (Numeric)': '',
            'You believe that Emids delivers the best business value for your money (Numeric)': '',
            'Relationship management (business understanding,stakeholder mgmt., customer centricity) (Numeric)': '',
            'Resource management (availability of key resources,managing transition, knowledge transfer) (Numeric)': '',
            'Quality of resources (knowledge , personnel , technical expertise) (Numeric)': '',
            'Execution excellence (program/project management, governance, coordination of multiple groups) (Numeric)': '',
            'Delivering on project/program KPIs (SLA, Scope, Budget, Timelines) (Numeric)': '',
            'Automation efforts to increase productivity/ efficiencies (Numeric)': '',
            'Quality of deliverables (Numeric)': '',
            'Leveraging agile/ DevOps to increase pace of deployment (Numeric)': '',
            'Emids has a strong understanding of your industry / domain (Numeric)': '',
            'Emids showcases the right technology solutions that are contextual to your business needs (Numeric)': '',
            'Emids demonstrates the ability to own & deliver end to end programs (Numeric)': '',
            'Emids adopts a consultative approach in crafting the right solutions for your needs (Numeric)': '',
            'Emids actively brings ideas / suggestions to enhance your program outcomes (Numeric)': '',
            'Emids proactively engages in discussions beyond the contract ( on strategic inputs, future roadmap, and thought leadership) (Numeric)': '',
            'Comp1 (Text)': '',
            'Reason1 (Text)': '',
            'Comp2 (Text)': '',
            'Reason2 (Text)': '',
            'Comp3 (Text)': '',
            'Reason3 (Text)': '',
            'What in your opinion differentiates Emids from other similar service providers? (Text)': '',
            'What are the areas you wish Emids could strengthen further? (Text)': '',
            'BusinessPriorities1 (Text)': '',
            'BusinessPriorities2 (Text)': '',
            'BusinessPriorities3 (Text)': '',
            'EmidsHelp1 (Text)': '',
            'EmidsHelp2 (Text)': '',
            'EmidsHelp3 (Text)': '',
            'OrgWide Capabilities - Generative AI': '',
            'OrgWide Capabilities - Product Strategy, Design & Engineering':'',
            'OrgWide Capabilities - Design-Led engineering': '',
            'OrgWide Capabilities - Modernization (Cloud migration and optimization)': '',
            'OrgWide Capabilities - Data Engineering (DI, DQ, DS)': '',
            'OrgWide Capabilities - Interoperability': '',
            'OrgWide Capabilities - Automation': '',
            'Platform implementation - Healthcare core platforms, Emids data platforms': '',
            'HC Domain Capabilities - Care Management': '',
            'HC Domain Capabilities - Population Health': '',
            'HC Domain Capabilities - Member Experience': '',
            'HC Domain Capabilities - Revenue Cycle Management': '',
            'HC Domain Capabilities - Payment Integrity': '',
            'HC Domain Capabilities - Claims Management': '',
            'HC Domain Capabilities - PBM': '',
            'HC Domain Capabilities - Clinical Trials': '',           
          };
        });
        const columns = ['Cycle', 'BU', 'Account Name', 'Program / Project Name (multiple project selection)', 'Client Respondent', 'Client Respondent Email',
          'Management Level (CEO/Senior/Operational)', 'Managing Partner', 'Client Partner / Account Manager', 'Delivery Head',
          'Delivery Manager', 'Project Manager', 'Studio Leader', 'Studio', 'Sub Studio', 'Project Type (A/B/C)', 'Engagement Type (Solution Based/IEP/ICP/Capacity Infusion)',
          'Focus Ac (Y/N)', 'NPS Score (Numeric)', 'NPS Category (Text)', 'Expectation 1 (Numeric)', 'Exp 1 rating (Text)', 'Expectation 2 (Numeric)', 'Exp 2 rating (Text)', 'Expectation 3 (Numeric)', 'Exp 3 rating (Text)',
          'You are very satisfied with your experience with Emids (Numeric)', 'You will definitely choose Emids for your future requirements (Numeric)', 'You believe that Emids delivers the best business value for your money (Numeric)',
          'Relationship management (business understanding, stakeholder mgmt., customer centricity) (Numeric)', 'Resource management (availability of key resources, managing transition, knowledge transfer) (Numeric)',
          'Quality of resources (knowledge, personnel, technical expertise) (Numeric)', 'Execution excellence (program/project management, governance, coordination of multiple groups) (Numeric)',
          'Delivering on project/program KPIs (SLA, Scope, Budget, Timelines) (Numeric)', 'Automation efforts to increase productivity/ efficiencies (Numeric)', 'Quality of deliverables (Numeric)',
          'Leveraging agile/ DevOps to increase pace of deployment (Numeric)', 'Emids has a strong understanding of your industry / domain (Numeric)',
          'Emids showcases the right technology solutions that are contextual to your business needs (Numeric)', 'Emids demonstrates the ability to own & deliver end to end programs (Numeric)', 'Emids adopts a consultative approach in crafting the right solutions for your needs (Numeric)', 'Emids actively brings ideas / suggestions to enhance your program outcomes (Numeric)',
          'Emids proactively engages in discussions beyond the contract ( on strategic inputs, future roadmap, and thought leadership) (Numeric)', 'Comp1 (Text)', 'Reason1 (Text)', 'Comp2 (Text)',
          'Reason2 (Text)', 'Comp3 (Text)', 'Reason3 (Text)', 'What in your opinion differentiates Emids from other similar service providers? (Text)', 'What are the areas you wish Emids could strengthen further? (Text)',
          'BusinessPriorities1 (Text)', 'BusinessPriorities2 (Text)', 'BusinessPriorities3 (Text)', 'EmidsHelp1 (Text)', 'EmidsHelp2 (Text)', 'EmidsHelp3 (Text)',
          'OrgWide Capabilities - Generative AI', 'OrgWide Capabilities - Product Strategy, Design & Engineering', 'OrgWide Capabilities - Design-Led engineering', 'OrgWide Capabilities - Modernization (Cloud migration and optimization)', 'OrgWide Capabilities - Data Engineering (DI, DQ, DS)', 'OrgWide Capabilities - Interoperability',
          'OrgWide Capabilities - Automation', 'Platform implementation - Healthcare core platforms, Emids data platforms', 'HC Domain Capabilities - Care Management', 'HC Domain Capabilities - Population Health', 'HC Domain Capabilities - Member Experience', 'HC Domain Capabilities - Revenue Cycle Management', 'HC Domain Capabilities - Payment Integrity',
          'HC Domain Capabilities - Claims Management', 'HC Domain Capabilities - PBM', 'HC Domain Capabilities - Clinical Trials'
        ]
        this.excelservice.exportAsExcelFile('Customer Satisfaction Score Template', '', columns, Data, 'Customer Satisfaction Score Template', 'Customer Satisfaction Score Template');
      });
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  }
}
