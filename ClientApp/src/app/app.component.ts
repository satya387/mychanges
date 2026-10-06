import { MsalService } from '@azure/msal-angular';
import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Spinkit } from 'ng-http-loader';

import { CommonService } from './common/common.service';

export let browserRefresh = false;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  token: any;
  isAuthenticated: boolean = false;
  subscription: Subscription;
  spinnerStyle = Spinkit;

  constructor(private authService: MsalService, private router: Router, private commonService: CommonService) {
    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }

  async ngOnInit() {
    this.isAuthenticated = await !!this.authService.instance.getTokenCache();
  }

  login() {
    this.authService.loginRedirect();
  }

  headerFooterHide() {
    return this.router.url.includes('/logout');
  }

}
