import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { OpportunityRlsExpenseService } from '../opportunity-rls-expense.service';
interface Timeline {
  id: number;
  opportunityId:string;
  createdBy: string;
  createdDate: string;
  title: string;
  nextStage:string;
  nextApprovalPerson:string;
  comments:string;
}

@Component({
  selector: 'app-timeline-details',
  templateUrl: './timeline-details.component.html',
  styleUrls: ['./timeline-details.component.scss']
})
export class TimelineDetailsComponent implements OnInit {
  opportunity: any
  id: any
  arr: Timeline[] = [];
  constructor(
    private oppRlsExpService: OpportunityRlsExpenseService,
    private router: Router,
    private activatedRoute: ActivatedRoute 
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log('Query Params:', params);

      this.id = params['id'];
      if (this.id) {
        this.GetTimeLineList();   // ✅ Call after id is set
      }
    });
  }
  GetTimeLineList(): void {
    this.oppRlsExpService.getAllRLSTimelineList(this.id).subscribe({
      next: (response: any) => {
        this.arr = Array.isArray(response) ? response : (response?.data ?? []);
        console.log('arry',this.arr)
      },
      error: (err) => {
        console.log('API Error:', err);
      }
    });
  }
  getLabel(title: string): string {
    if (title === 'Created Opportunity') return 'Created By';
    if (title === 'Submitted for Approval') return 'Submitted By';
    if (title === 'Rejected Opportunity') return 'Rejected By';
    return 'Approved By';
  }
  goBack() {
    this.router.navigate(['/resource-loading']);
  }
}
