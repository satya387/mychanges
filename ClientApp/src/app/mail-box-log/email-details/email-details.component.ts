import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MailBoxLogService } from '../mail-box-log.service';
import { CcList, Email, ToList } from '../email.model';

@Component({
  selector: 'app-email-details',
  templateUrl: './email-details.component.html',
  styleUrls: ['./email-details.component.scss']
})
export class EmailDetailsComponent implements OnInit {

  email : Email;
  constructor(private route: ActivatedRoute,private router: Router, private mailBoxService: MailBoxLogService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.mailBoxService.getEmailById(id)
      .subscribe(email => this.email = email);
  }

  goBack(): void {
    this.router.navigate(['/email-list']);
  }

  getToList(toList: ToList[]): string {
    return toList ? toList.map(to => to.name).join(', ') : '';
  }

  getCcList(ccList: CcList[]): string {
    return ccList ? ccList.map(cc => cc.name).join(', ') : '';
  }
}