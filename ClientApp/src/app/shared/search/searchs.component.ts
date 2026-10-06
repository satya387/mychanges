import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
//import { SEARCH_RESULTS } from 'src/app/common/search-content.json';
import { ActivatedRoute } from '@angular/router';
import { Pagination_Items_Per_Page, settings } from '../../common/configuration.settings';
import { SearchComponentService } from './search.service';
import { query } from '@angular/animations';
@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  inputText: string;
  private subjectKeyUp = new Subject<any>();
  searchlist: any
  limit: any = settings.limit;
  offset: any = settings.offset;
  designation: any = settings.roleName;
  page: any = 1;
  itemsPerPageList = Pagination_Items_Per_Page;
  totalRecord: any;
  results: any;
  searchResult: any;

  constructor(private searchService: SearchComponentService, private route: Router, private activatedRoute: ActivatedRoute) {
    /*this.totalRecord = this.searchList.length;*/
  }

  ngOnInit() {

    // alert('search comp');
    let query = this.activatedRoute.snapshot.paramMap.get('query');
    console.log(query);
    this.searchService.getsearch(query).subscribe((d) => {
      console.log(d);
      // var obj = d;
      this.searchlist = d;
      //localStorage.setItem('obj', JSON.stringify(obj));
    }, error => {
      console.error(error);
    }
    );




  }

  onTableDataChange(event: any) {
    this.offset = event;
    this.page = this.offset;
  }
  //getsearchall(query: string) {
  //  //localStorage.setItem('obj', "");
  //  //localStorage.clear();

  //  this.searchService.getsearch(query).subscribe((d) => {
  //    console.log(d);
  //   // var obj = d;
  //    this.searchlist = d;
  //    //localStorage.setItem('obj', JSON.stringify(obj));
  //  }, error => {
  //    console.error(error);
  //  }
  //  );



  //}
}
