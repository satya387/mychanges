import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SectionService } from '../../section/section.service';
import { ToastService } from '../../../common/toast/toast.service';

@Component({
  selector: 'app-role-section',
  templateUrl: './role-section.component.html',
  styleUrls: ['./role-section.component.scss']
})
export class RoleSectionComponent implements OnInit {
  selectedSectionList: any;
  roleId: any;
  roleName: any;

  constructor(private route: ActivatedRoute, private sectionService: SectionService,
               private toastService: ToastService, private router: Router ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const data = JSON.parse(params.data);
      this.roleId = parseInt(data.roleId);
      this.roleName = data.roleName;
    });
    this.getRoleBasedSections();
  }

  getRoleBasedSections() {
    this.sectionService.getRoleBasedSection(this.roleId).subscribe((response: any) => {
      if (response) {
        this.selectedSectionList = response;
      }
    }, (error: any) => {
      this.toastService.showError(error, 'Error');
    });
  }

  gotoEdit() {
    const roleDetails = { roleId: this.roleId, roleName: this.roleName };
    this.router.navigate(['/edit-role'], { queryParams: { isAdd: false, data: JSON.stringify(roleDetails) } });
  }

}
