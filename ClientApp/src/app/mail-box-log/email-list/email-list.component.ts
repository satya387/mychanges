import { Component, OnInit, ViewChild } from '@angular/core';
import { MailBoxLogService } from '../mail-box-log.service';
import { Router } from '@angular/router';
import { Email } from '../email.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit {

  emails = new MatTableDataSource<Email[]>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private mailBoxLogService: MailBoxLogService) { }

  ngOnInit(): void {
    this.loadEmails();
  }

  loadEmails(){
    this.mailBoxLogService.getEmailsList().subscribe(emailsList => {
      const savedPageInfo = localStorage.getItem('emailListPageInfo');
    if (savedPageInfo) {
      const pageInfo = JSON.parse(savedPageInfo);
      this.paginator.pageIndex = pageInfo.pageIndex;
      this.paginator.pageSize = pageInfo.pageSize;
      localStorage.removeItem('emailListPageInfo');
    }
      this.emails.data = emailsList;
      this.emails.paginator = this.paginator;
    });
  }

  viewMailDetail(id: number) {
    const pageInfo = {
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    localStorage.setItem('emailListPageInfo', JSON.stringify(pageInfo));
    this.router.navigate(['/email-detail', id]);
  }

  exportToExcel(): void {
    const excelData = this.emails.data.map((email: any) => {
      return {
        'From': email.fromEmail,
        'Subject': email.subject,
        'Received': email.emailReceivedDateTime ? new Date(email.emailReceivedDateTime).toLocaleString() : '',
        'To': email.toList ? email.toList.map(to => to.name).join(', ') : '',
        'CC': email.ccList ? email.ccList.map(cc => cc.name).join(', '): ''
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Emails');

    // Save the Excel file
    XLSX.writeFile(wb, 'emails.xlsx');
  }
}
