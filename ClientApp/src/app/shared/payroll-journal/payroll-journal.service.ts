import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { PAYROLL_JOURNAL_URLS } from './payroll-journal.url-config';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class PayrollJournalService {
  viewAllTileDetail: any;

  constructor(private http: HttpClient) { }

  uploadPayrollJournal(requestBody) {
    debugger;
    console.log('requestBody - ', requestBody);
    //var formData = new FormData();
    //formData.append('jsonData', requestBody);
    //console.log('formdata - ', formData);

    //var inputData = JSON.stringify(requestBody);
    //console.log('inputData - ', inputData);
    //return this.http.post(PAYROLL_JOURNAL_URLS.UPLOAD_PAYROLL_JOURNAL, requestBody);
    var a = this.http.post(PAYROLL_JOURNAL_URLS.UPLOAD_PAYROLL_JOURNAL, requestBody);
    debugger;
    return a;
  }

  getPayrollJournalDataforReportDownload(strLocation, payrollJournalUploadDate) {
    const params = new HttpParams()
      .set('strLocation', strLocation)
      .set('payrollJournalUploadDate', payrollJournalUploadDate);
    var a = this.http.get(PAYROLL_JOURNAL_URLS.GET_PAYROLL_JOURNAL_REPORT_DATA, { params });
    return a;
    //.map((res: Response) => res.json());
  }
  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_Download_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  getPayrollJournalGridViewData(payrollJournalUploadDate) {
    const params = new HttpParams()
      .set('payrollJournalUploadDate', payrollJournalUploadDate);
    var a = this.http.get(PAYROLL_JOURNAL_URLS.GET_PAYROLL_JOURNAL_GRID_DATA, { params });
    return a;
    //.map((res: Response) => res.json());
  }
}
