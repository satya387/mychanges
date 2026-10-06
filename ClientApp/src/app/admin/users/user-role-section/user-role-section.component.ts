import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-role-section',
  templateUrl: './user-role-section.component.html',
  styleUrls: ['./user-role-section.component.scss']
})
export class UserRoleSectionComponent implements OnInit {

  userName: any;
  userId: any;
  selectedTab: any;

  constructor( private activatedRoute: ActivatedRoute) {  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const userData = JSON.parse(params.data);
      this.userName = userData.name;
      this.userId = userData.userId;
      this.selectedTab = userData.targetTab ? userData.targetTab : 'role';
    });
  }


}
