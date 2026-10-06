import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { map, filter, forEach } from 'lodash';
import { Router } from '@angular/router';

import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { ToastService } from '../common/toast/toast.service';

import { Image_Dimensions, settings, SETTINGS_MENUS } from '../common/configuration.settings';
import { CommonService } from '../common/common.service';
import { HomeService } from './home.service';
import { SectionService } from '../admin/section/section.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TilesService } from '../admin/tiles/tiles.service';
import { environment } from "../../environments/environment";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  loginDisplay = false;
  userInfo: any;
  isAuthenticated: boolean;
  idleState: any;
  timedOut = false;
  menuList: any = SETTINGS_MENUS;
  sectionList: any;
  activeSectionList: any;
  isPersonalizedSections: boolean;
  bannerList: any;
  imageDimensions = Image_Dimensions;
  profileImage: any;
  public moduleSearchText: string ="";
  public showOnlyBookmark: boolean = false;
  public showBookmark: number = 0;
  addBookMarkForm: FormGroup;
  clickedIcon: string = "musical-waves";
  bookMarkName: any;
  minLength: any = settings.minLength;
  maxLength: any = settings.maxLength;
  urlPattern: any = settings.URL_PATTERN;


  constructor(public msalService: MsalService, private toastService: ToastService, private homeService: HomeService, private sectionService: SectionService,
    private idle: Idle, private keepalive: Keepalive, private router: Router, private commonService: CommonService, config: NgbCarouselConfig, private formBuilder: FormBuilder, private tileService: TilesService,) {
    this.detectIdleSession();
    this.isPersonalizedSections = false;
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  async ngOnInit() {
    this.formInitialization();
    await this.checkAccount();
  }

  // func. to get access token after successfull login
  async checkAccount() {
    debugger;
    this.isAuthenticated = await !!this.msalService.instance.getTokenCache();
    if (this.isAuthenticated) {
      let userInfo: any = JSON.stringify(window.sessionStorage);
      let userJson: any = JSON.parse(userInfo);
      if (userJson.hasOwnProperty('userDetail')) {
        const userData = JSON.parse(userJson.userDetail)
        this.userInfo = { 'Email': userData.Email };
      } else {
        map(userJson, (data) => {
          data = JSON.parse(data);
          if (data.hasOwnProperty('username') && data.hasOwnProperty('name')) {
            this.userInfo = { 'Email': data.username };
          }
        });
      }
      this.getToken();
    }
  }

getToken() {
    this.commonService.getCustomToken(this.userInfo).subscribe((response: any) => {
      if (response) {
        const userDetail: any = JSON.parse(atob(response.token.split('.')[1]));
        sessionStorage.setItem('customToken', response.token);
        sessionStorage.setItem('userDetail', JSON.stringify(userDetail));
      
        //const userDetail: any = JSON.parse(atob(response.token.split('.')[1]));
        //sessionStorage.setItem('customToken', response.token);
        //sessionStorage.setItem('userDetail', JSON.stringify(userDetail));
        this.homeService.userNameUpdated(true);
        this.getSectionListByUser(userDetail.UserId);
        this.getBannerList();
        this.getUserProfile();
      } else {
        this.toastService.showWarning('Your account is not verified yet!', 'Alert!');
        setTimeout(() => {
          this.msalService.logout();
          return;
        }, 3000);
      }
    }, (error: any) => {
      this.toastService.showError('Please login again!', 'Alert');
      // this.msalService.logout();
    })
  }

  getSectionListByUser(userId) {
    this.commonService.homeSectionList(userId).subscribe((response: any) => {
      if (response) {
        this.sectionList = response;
        this.activeSectionList = filter(this.sectionList, { 'isActive': true });
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  getBannerList() {
    //if(localStorage.getItem('WhenCacheCleared') == null) {
    //  localStorage.setItem('WhenCacheCleared', new Date().getTime().toString());
    //}
    //else {
    //  let cacheClearedAT = localStorage.getItem('WhenCacheCleared');
    //  let currentCache = new Date().getTime();

    //  if (currentCache - Number(cacheClearedAT) > 7200000) {//21600000) { //21600000 - 2 hrs
    //    var empauthid: string;
    //    let userInfo: any = JSON.stringify(window.sessionStorage);
    //    let userJson: any = JSON.parse(userInfo);
    //    if (userJson.hasOwnProperty('userDetail')) {
    //      const userData = JSON.parse(userJson.userDetail)
    //      empauthid = userData.EmpAuthId;
    //    }
    //    this.commonService.removeCachedData(empauthid).subscribe((response: any) => {
    //      if (response) {
    //        localStorage.setItem('WhenCacheCleared', new Date().getTime().toString());
    //      }
    //    }, (error: any) => {
    //    })
    //  }

    //}
    this.commonService.getBannerImages().subscribe((response: any) => {
      if (response) {
        this.bannerList = response;
        this.imageCompatibility();
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    })
  }

  isBannerVisible() {
    return this.homeService.showBanner;
  }

  getUserProfile() {
    this.commonService.getProfileImage().subscribe((response: any) => {
      if (response) {
        this.profileImage = response.data.url;
        sessionStorage.setItem('profileImage', this.profileImage);
      }
    });
  }

  imageCompatibility() {
    forEach(this.bannerList, (img) => {
      map(img.contentData, (data) => {
        if (data.orientation === 'Tablet (Portrait)') {
          data['portraitImg'] = data.imageUrl;
        } else if (data.orientation === 'Tablet (Landscape)') {
          data['landscapeImg'] = data.imageUrl;
        } else if (data.orientation === 'Mobile') {
          data['mobileImg'] = data.imageUrl;
        } else if (data.orientation === 'Desktop') {
          data['desktopImg'] = data.imageUrl;
        }
      });
    })
  }

  async login() {
    this.msalService.loginRedirect();
  }

  logout() {
    this.toastService.showSuccess('Logged out successfully!', 'Logout');
    this.msalService.logout();
  }

  detectIdleSession() {
    // sets an idle timeout of 5 seconds, for testing purposes.
    this.idle.setIdle(300);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(300);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      // this.idleState = 'No longer idle.'
      this.reset();
    });

    this.idle.onTimeout.subscribe(() => {
      // this.idleState = 'Timed out!';
      this.timedOut = true;
      window.location.reload();
    });

    this.idle.onIdleStart.subscribe((countdown) => {
      this.toastService.showWarning('You\'ve gone idle', 'Info')
      // this.childModal.show();
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      // this.idleState = 'You will time out in ' + countdown + ' seconds!'
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    // this.keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    // this.idleState = 'Started.';
    this.timedOut = false;
  }

  navigateTo(routeLink) {
    this.router.navigate([routeLink]);
  }

  personalizeSections() {
    this.isPersonalizedSections = true;
    this.sectionService.savePersonalizeSection().subscribe((response: any) => {
      if (response) { }
    })
  }

  changeSectionStatusOrder(userId) {
    this.isPersonalizedSections = false;
    if (userId) {
      this.getSectionListByUser(userId);
    }
  }

  gotoContentPage(data) {
    sessionStorage.setItem('ContentData', JSON.stringify(data));
    this.router.navigate(['/content-page']);
  }

  showBookmarkClick() {
    this.addBookMarkForm.reset();
    this.clickedIcon = "musical-waves";
    this.showBookmark = 1;
  }

  isBookmarkValid(bookMarkName, bookMarkURL) {
    let bookmarkList =JSON.parse(localStorage.getItem('bookmarkList'));
    for(let i = 0; i < bookmarkList.length; i++) {
      if( bookmarkList[i].bookMarkName?.toLowerCase() === bookMarkName?.toLowerCase() && bookmarkList[i].url?.toLowerCase()=== bookMarkURL?.toLowerCase()) {
        return false;
      }
    }
    return true;
  }
  createBookMark() {
    if( this.isBookmarkValid(this.addBookMarkForm.value.bookMarkName.trim(), this.addBookMarkForm.value.bookMarkURL) ) {
      this.addBookMarkForm.controls.bookMarkName.patchValue(this.addBookMarkForm.value.bookMarkName.trim())
      if (!this.addBookMarkForm.value.bookMarkName) { this.addBookMarkForm.setErrors({ 'invalid': true }); }
      if (this.addBookMarkForm.valid) {
        const bookMarkObject = {
          'BookMarkName': this.addBookMarkForm.value.bookMarkName.toString(),
          'Url': this.addBookMarkForm.value.bookMarkURL || null,
          'IconName':this.clickedIcon
        }
        this.tileService.createBookMark( bookMarkObject).subscribe((response: any) => {
          if (response && !response.isError) {
            this.toastService.showSuccess(response.message, 'Success');
            window.location.reload();
          } else {
            this.toastService.showWarning(response.message, 'Alert');
            return;
          }
        }, (error: any) => {
          this.toastService.showError(error, 'Error');
        });
      }
  }
  else {
    alert("This combination of Bookmark name and Bookmark url already exist");
  }
}

formInitialization(data?) {
  console.log(data , "getting form data");
  
  this.addBookMarkForm = this.formBuilder.group({
    bookMarkName: [data ? data.bookMarkName?.trim() : '', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength), this.noWhitespaceValidator]],
    bookMarkURL: [data ? data.url : '', [Validators.pattern(this.urlPattern)]],
  })
}

public noWhitespaceValidator(control: FormControl) {
  let isWhitespace = (control.value || '').trim().length === 0;
  if( control.value.length != control.value.trim().length) {
    isWhitespace = true;
  }
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}

onIconClick(clickedIcon: string) {
  this.clickedIcon = clickedIcon;
}

}
