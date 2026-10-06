import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: ['./back-button.component.scss']
})
export class BackButtonComponent implements OnInit {
  returnRouterUrl: any;

  @Input() set routerPath(val){
    this.returnRouterUrl = val;
  }

  constructor(private route: Router) { }

  ngOnInit(): void {
  }

  backToList(){
    this.route.navigate([this.returnRouterUrl]);
  }

}
