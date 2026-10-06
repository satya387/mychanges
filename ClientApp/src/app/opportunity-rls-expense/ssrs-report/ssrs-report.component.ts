import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ssrs-report',
  templateUrl: './ssrs-report.component.html',
  styleUrls: ['./ssrs-report.component.scss']
})
export class SsrsReportComponent {
  username: string = 'EMIDS-ARCRD\\Procurement';
  password: string = 'Emids@123';


  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    //this.login();
  }
  reportUrl: string = "https://app.powerbi.com/reportEmbed?reportId=69f6894d-b0d1-4449-90c0-647e9ee6ba7a&autoAuth=true&ctid=6077507f-bcd4-4ca1-bebd-e4ac1d05ffa4";

  login() {
  this.http.post('https://arc4.emids.com/ReportServer/Pages/ReportViewer.aspx', {
      username: this.username,
      password: this.password
    }).subscribe(response => {
      // Store the token (e.g., in local storage)
      //localStorage.setItem('token', this.token);
      // Redirect to report view
    }, error => {
      console.error('Login failed', error);
    });
  }
}