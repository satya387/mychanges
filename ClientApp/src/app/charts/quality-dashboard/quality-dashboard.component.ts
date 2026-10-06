import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-quality-dashboard',
  templateUrl: './quality-dashboard.component.html',
  styleUrls: ['./quality-dashboard.component.scss']
})
export class QualityDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  redirectToExecutiveDashboard() {
    window.open('https://executivedashboard2.azurewebsites.net/dashboard/projects', '_blank');
  }

}
