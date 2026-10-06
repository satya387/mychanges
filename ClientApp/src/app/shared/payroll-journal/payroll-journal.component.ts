import { Component, OnInit, NgModule, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { PayrollJournalService } from './payroll-journal.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { Observable } from 'rxjs';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-request-resource',
  templateUrl: './payroll-journal.component.html',
  styleUrls: ['./payroll-journal.component.scss']
  //styles: ['.example-month-picker .mat-calendar-period-button {pointer-events: none;} .example-month-picker .mat-calendar-arrow {display: none;}'],
})

export class PayrollJournalComponent {
  uploaddate = new FormControl(moment());
  selectedDate: any;
  title = 'read-excel-in-angular8';
  storeData: any;
  csvData: any;
  jsonData: any;
  inputData: any;
  textData: any;
  htmlData: any;
  fileUploaded: File;
  fileName: any;
  worksheet: any;
  responseMessage: string;
  excelData = [];

  constructor(private toastService: ToastService, private payrollJournalService: PayrollJournalService, private router: Router) {
    this.selectedDate = this.uploaddate.value.format("MMM YYYY");

  }
  private classActivate = 'active';
  private menus = ['INDIA', 'USA'];

  public onMouseUp(event) {
    const id = event.currentTarget.id;
    for (const menu of this.menus) {
      if (id === menu) {
        this.toggleActivation(event.currentTarget);
      } else {
        this.deactivate(event.currentTarget);
      }
    }
  }

  private toggleActivation(target: Element) {
    if (target.classList.contains(this.classActivate)) {
      target.classList.remove(this.classActivate);
    } else {
      target.classList.add(this.classActivate);
    }
  }

  private deactivate(target: Element) {
    if (target.classList.contains(this.classActivate)) {
      target.classList.remove(this.classActivate);
    }
  }

  uploadedFile(event) {
    debugger;
    this.fileUploaded = event.target.files[0];
    this.fileName = event.target.files[0].name;
    this.readExcel();
  }
  readExcel() {
    debugger;
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      //const wbFileName: string = wb. 
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.worksheet = ws;
    };
    reader.readAsArrayBuffer(this.fileUploaded);
  }
  readAsJson() {
    debugger;
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
    if (this.jsonData.length > 0) {
      this.inputData = JSON.stringify(this.jsonData);
      this.inputData = this.inputData.replace(/\*/g, '');
      const data: Blob = new Blob([this.jsonData], { type: "application/json" });
      this.uploadPayrollJournal();
    }
    else {
      this.toastService.showError('Please choose a file to upload', 'Error');
      return;
    }
    //FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + '.json');
  }

  generateRequestBody(inputJsonData) {
    debugger;
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    let loggedInUser = userData.EmployeeId;
    const object = {
      data: inputJsonData,
      PayrollJournalUploadForDate: this.selectedDate,
      UploadedBy: loggedInUser,
      UploadedFileName: this.fileName
    }
    debugger;
    return object;
  }

  uploadPayrollJournal() {
    debugger;
    const requestBody = this.generateRequestBody(this.inputData);
    this.payrollJournalService.uploadPayrollJournal(requestBody).subscribe((response: any) => {
      // console.log("respone - ", response);
      // console.log("responeData - ", response.data);
      debugger;
      if (response && !response.isError) {
        this.toastService.showSuccess(response.message, 'Success');
        this.worksheet = "";
        let element: HTMLElement = document.getElementById('btnReset') as HTMLElement;
        element.click();
        this.router.navigate(['/payroll-journal']);
      } else {
        this.toastService.showError(response.message, 'Error');
        this.worksheet = "";
        return;
      }
    })
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.uploaddate.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.uploaddate.setValue(ctrlValue);
    this.selectedDate = this.uploaddate.value.format("MMM YYYY");
    datepicker.close();
    //this.getGridData();
  }
  exportAsXLSX(strLocation): void {
    debugger;
    this.getDownloadReportData(strLocation);
    //console.log("exportAsXLSX respone excelData - ", this.excelData);
  }
  getDownloadReportData(strLocation) {
    this.payrollJournalService.getPayrollJournalDataforReportDownload(strLocation, this.selectedDate).subscribe((data: any) => {
      // console.log("responeData - ", data.data);
      if (data) {
        let responseData = data.data.replace(/_/g, ' ');
        let jo = JSON.parse(responseData);
        for (let i = 0; i < jo.length; i++) {
          this.excelData[i] = jo[i];
        }
        this.payrollJournalService.exportAsExcelFile(this.excelData, 'PayrollJournal');
      }
    });
  }
  getGridData() {
    this.payrollJournalService.getPayrollJournalGridViewData(this.selectedDate).subscribe((data: any) => {
      // console.log("respone - ", data);
      // console.log("responeData - ", data.data);
      if (data) {
        let responseData = data.data.replace(/_/g, ' ');
        let jo = JSON.parse(responseData);
        for (let i = 0; i < jo.length; i++) {
          this.excelData[i] = jo[i];
        }
        this.payrollJournalService.exportAsExcelFile(this.excelData, 'PayrollJournal');
        //console.log("getData respone excelData - ", this.excelData);
      }
    });
  }
}
