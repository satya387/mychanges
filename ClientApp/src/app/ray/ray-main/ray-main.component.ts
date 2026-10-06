import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ray-main',
  templateUrl: './ray-main.component.html',
  styleUrls: ['./ray-main.component.scss']
})
export class RayMainComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateToOtherModule() {
    this.router.navigate(['/ray']);
  }

}
