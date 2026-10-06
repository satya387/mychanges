import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized-access-page',
  templateUrl: './unauthorized-access-page.component.html',
  styleUrls: ['./unauthorized-access-page.component.scss']
})
export class UnauthorizedAccessPageComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
    this.hidePath();
  }

  private hidePath() {
    const stateObj = { id: 'unauthorized-access' };
    const title = '';

    history.replaceState(stateObj, title, '/');
  }
}
