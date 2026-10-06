import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { includes, find, isArray } from 'lodash';
import { environment } from "../../../environments/environment";
import { SETTINGS_MENUS, settings } from 'src/app/common/configuration.settings';
import { TILE_INFO } from 'src/app/common/static-tile-info.settings';
import { ToastService } from 'src/app/common/toast/toast.service';
import { HomeService } from 'src/app/home/home.service';
import { browserRefresh } from 'src/app/app.component';
import { AlertsComponentService } from '../alerts/alert.service';
import { SearchComponentService } from '../search/search.service';
import { CommonService } from '../../common/common.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import * as pdfjsLib from 'pdfjs-dist';
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.min.js';
declare var bootstrap: any;
export interface CodeOfConduct {
  isAccepted: boolean;
  documentPath: string;
  viewSequence: number;
  location: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

  settingsMenuList = SETTINGS_MENUS;
  userInfo: any;
  userInfoSubscribe$: any;
  staticTilesList = TILE_INFO;
  isAdmin: any;
  showSearch: any;
  public browserRefresh: boolean;
  roleName: any = settings.roleName;
  isAuthenticated: boolean;
  peopleurl: any;
  searchResult: any;
  alerts: any;
  count: any;
  showOnlyBookmark: boolean;
  public hasArcAccess: boolean;
    urlPattern: any = settings.URL_PATTERN;
    CocResult: any;
    showCocPopup = false;
    acceptCoc = false;
      clickedIcon: string = "musical-waves";
    cocPdfUrl!: SafeResourceUrl;
    cocModal: any;
    @ViewChild('pdfCanvas')
    pdfCanvas!: ElementRef<HTMLCanvasElement>;

    

  constructor(private route: Router, public msalService: MsalService, private toastService: ToastService, public homeService: HomeService,
    private modalService: AlertsComponentService, private commonService : CommonService , private searchService: SearchComponentService,private sanitizer: DomSanitizer) {
    this.userInfoSubscribe$ = this.homeService.updatedUserName().subscribe((response: any) => {
      if (response) {
        this.getUserDetail();
        this.peopleapi();
        this.getalerts();
        this.checkCodeOfConduct()
      }
    });
    this.browserRefresh = browserRefresh;
    if (this.browserRefresh) {
      this.getUserDetail();
      this.peopleapi();
      this.getalerts();
      this.loadCodeOfConduct();
    }
    this.showSearch = false;

  }

  ngOnInit(): void {
    this.getUserDetail();
    this.isBannerVisible();
    this.peopleapi();
    this.getalerts();
    this.checkCodeOfConduct();
    //this.getalert();
  }

  peopleapi() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    if(userData.HasArcAccess.toLowerCase() == 'true') {
      this.hasArcAccess = true;
    } else {
      this.hasArcAccess = false;
    }
    const auth = userData.EmpAuthId;
    const email = userData.EmpFullEmailId;
    const peopleUrl = environment.arcBaseUrl;
    const apiUrl = "/Dashboard/Clientlogin?email=" + email + "&oauth=" + auth + "&redirectURL=people/department&isNewArcLogin=false";
    this.peopleurl = peopleUrl + apiUrl;
  }

  logout() {
    var empauthid: string;
    let userInfo: any = JSON.stringify(window.sessionStorage);
    let userJson: any = JSON.parse(userInfo);
    if (userJson.hasOwnProperty('userDetail')) {
      const userData = JSON.parse(userJson.userDetail)
      console.log(userData.EmpAuthId);
      empauthid = userData.EmpAuthId;
    }
    this.commonService.removeCachedData(empauthid).subscribe((response: any) => {
      if (response) {
        localStorage.removeItem("isNewArcLogin");
        this.toastService.showSuccess('Logged out successfully!', 'Logout')
        this.msalService.logout();
      }
    }, (error: any) => {
      this.toastService.showSuccess('Logged out successfully!', 'Logout')
      this.msalService.logout();
    })

  }

  getUserDetail() {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const profilePicture = sessionStorage.getItem('profileImage');
    if (userData) {
      this.isAdmin = includes(userData.Roles, this.roleName);
      this.userInfo = userData;
      this.userInfo.profilePicture = profilePicture;
      let roleType = isArray(userData.Roles);
      if (roleType && userData.Roles.length === 1 && includes(userData.Roles, this.roleName)) {
        this.userInfo.Roles = userData.Roles;
      } else if (roleType) {
        userData.Roles.splice(userData.Roles.indexOf(this.roleName), 1);
        this.userInfo.Roles = userData.Roles;
      } else {
        this.userInfo.Roles = userData.Roles;
      }
    }
  }

  navigateTo(data) {
    const tileData = find(this.staticTilesList, { key: data });
    this.homeService.getTileDetailByTileCode(tileData.tileCode).subscribe((response: any) => {
      if (response.data) {
        this.createDynamicElement(response.data);
      }
    })
  }

  createDynamicElement(data) {
    const parseData = JSON.parse(data.configuration);
    data.tileLink = parseData.Link;
    let htmlElement = document.createElement('a');
    htmlElement.href = data.tileLink;
    htmlElement.target = '_blank';
    htmlElement.click();
    document.body.appendChild(htmlElement);
  }

  openUrl() {
    window.open("https://emids-my.sharepoint.com/:f:/p/sharathv/Er3g4WOgc9NHgwNGzDPd4pUBkfBYQta-2yjvhpyMrcRdhA?e=xKhryp", "_blank");
  }

  onMenuClick() {
    (<HTMLElement>document.getElementsByClassName('modal-dialog modal-md')[0]).style.display = 'none';
  }
  

  isBannerVisible() {
    this.homeService.showBanner = false;
    if( localStorage.getItem('isBannerVisible') == null || (localStorage.getItem('isBannerVisible') && localStorage.getItem('isBannerVisible') === "1")) {
      this.homeService.showBanner = true;
    } 

    this.showOnlyBookmark = this.homeService.showBanner;
  }

  onBannerBtnClick() {
    this.homeService.showBanner = !this.homeService.showBanner;
    var a = "showBanner";
    var _showBanner = "showBanner text";
    if(this.homeService.showBanner === true ) {
      localStorage.setItem("isBannerVisible", "1");
    } else {
      localStorage.setItem("isBannerVisible", "0");
    }
  }

  openAlerts() {
    if(this.count > 0 ) {
      this.modalService.confirm('Delete Role', 'Are you sure you want to delete role?')
      .then((confirmed) => {
        console.log(confirmed);
      }
      ).catch();
    }
  }

  openSearch() {
   // this.searchService.confirm('Delete Role', 'Are you sure you want to delete role?')
   // .then((confirmed) =>{
   //   console.log();
   // }
   // ).catch();
   this.route.navigate(['search']);
  }
  
  searchall(query: KeyboardEvent) {
    if (query) {
      const element = query.target as HTMLInputElement;
      console.log(element.value);
      //this.searchService.getsearch(element.value).subscribe((result) => {
      //  this.searchResult = result;
      //  console.log(this.searchResult);
      //})
    }
  }
  submitSearch(val: string) {
    console.log(val);
    //this.route.navigate(['search/${val}']);
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([`search/${val}`]);
    }); 
  }
  getalerts(): void {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const ManagerId = userData.EmployeeId;
    //const ManagerId = 'INEMP2057';
    // this.modalService.getalerts(ManagerId).subscribe((result) => {
    //   this.searchResult = result;
    //   //console.log(this.searchResult);
    //   this.getalert();
    // })

  }
  getalert(): void {
    const userData = JSON.parse(sessionStorage.getItem('userDetail'));
    const empId = userData.EmployeeId;
    this.modalService.getalert(empId).subscribe((result) => {
      this.alerts = result;
      //console.log(this.alerts);
      var k = (this.searchResult.length) + this.alerts.length;
      //console.log(k)
      this.count = k;
      //console.log(this.count);
    })
  }
  
  onIconClick(clickedIcon: string) {
    this.clickedIcon = clickedIcon;
  }
  checkCodeOfConduct() {
    this.commonService.checkCodeOfConductAcceptance()
      .subscribe((res: CodeOfConduct[])=> {

        if (!res || res.length === 0) {
    return;
  }

  this.CocResult = res[0];
   console.log(this.CocResult);
  localStorage.setItem(
    'codeOfConductAccepted',
    this.CocResult.isAccepted ? '1' : '0'
  );

  if (this.CocResult.isAccepted) {
    return;
  }

  this.openCocPopup();
      }, error => {
        console.error(error);
      });
  }
  openCocPopup() {

    const modalElement = document.getElementById('cocModal');

    modalElement.addEventListener('hidden.bs.modal', () => {
      console.log('Modal Hidden Event Fired');
    });

    this.cocModal = bootstrap.Modal.getOrCreateInstance(modalElement);

    this.cocModal.show();

    setTimeout(() => this.loadPdf(), 200);
  }
  loadCodeOfConduct() {

    const cocStatus = localStorage.getItem('codeOfConductAccepted');

    if (cocStatus === '1') {
        return;
    }

    if (cocStatus === '0') {
        this.openCocPopup();
        return;
    }

    this.checkCodeOfConduct();
}
  submitCodeOfConduct() {
  
    if (!this.acceptCoc) {
      this.toastService.showWarning(
        'Please accept the Code of Conduct.',
        'Warning'
      );
      return;
    }
  
            this.commonService.acceptCodeOfConduct().subscribe((res: any) => {

          localStorage.setItem('codeOfConductAccepted', '1');
          this.toastService.showSuccess(
          'Code of Conduct accepted successfully.',
          'Success'
        );
          this.cocModal?.hide();

          this.route.navigate(['/']);

        });
  }
  @ViewChild('pdfContainer', { static: false })
  pdfContainer!: ElementRef<HTMLDivElement>;
  async loadPdf() {
     if (!this.CocResult || !this.CocResult.documentPath) {
    return;
  }
    const loadingTask = pdfjsLib.getDocument({
      url: this.CocResult.documentPath
    });
  
    const pdf = await loadingTask.promise;
  
    const container = this.pdfContainer.nativeElement;
    container.innerHTML = '';
  
    const renderTasks = [];
  
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
  
      renderTasks.push((async () => {
  
        const page = await pdf.getPage(pageNumber);
  
        const viewport = page.getViewport({ scale: 1.4 });
  
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!;
  
        canvas.width = viewport.width;
        canvas.height = viewport.height;
  
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto 15px auto';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
  
        // Reserve the correct position for this page
        const pageWrapper = document.createElement('div');
        pageWrapper.id = `page-${pageNumber}`;
        pageWrapper.appendChild(canvas);
  
        container.appendChild(pageWrapper);
  
        await page.render({
          canvasContext: context,
          viewport
        }).promise;
  
      })());
  
    }
  
    await Promise.all(renderTasks);
  }
}
