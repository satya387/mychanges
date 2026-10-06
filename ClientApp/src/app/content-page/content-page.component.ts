import { Component, OnInit } from '@angular/core';
// import * as customBuild from 'customCKEditor/build/ckeditor';
import * as customBuild from 'customCKEditor/build/ckeditor';
// F:\LIVANYA DATA\KALPITA\ARC_Portal\Emids.ARCPortal\ClientApp\customCKEditor\build\ckeditor.js
// customCKEditor\build\ckeditor.js

import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-content-page',
  templateUrl: './content-page.component.html',
  styleUrls: ['./content-page.component.scss']
})
export class ContentPageComponent implements OnInit {

  contentData: any;
  public Editor = customBuild;

  constructor(private homeService: HomeService) {
    this.contentData = JSON.parse(sessionStorage.getItem('ContentData'));
  }

  ngOnInit(): void {
  }

}
