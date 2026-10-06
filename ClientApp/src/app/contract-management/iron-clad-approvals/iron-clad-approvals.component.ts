import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-iron-clad-approvals',
  templateUrl: './iron-clad-approvals.component.html',
  styleUrls: ['./iron-clad-approvals.component.scss']
})
export class IronCladApprovalsComponent implements OnInit {
reviewers = [
    {
      initials: 'RV',
      name: 'Ravindrakumar Veluswamy',
      role: 'Secondary Workflow Owner/Reviewer',
      instruction: 'You have been assigned to review this contract.',
      status: 'Approved'
    },
    {
      initials: 'VS',
      name: 'Vineet Sharma',
      role: 'Pricing Team - Pricing Approval',
      instruction: 'Please review pricing details.',
      status: 'Awaiting Review'
    },
    {
      initials: 'BT',
      name: 'Benjamin Tuttle',
      role: 'Legal Approval',
      instruction: 'Please review legal clauses.',
      status: 'Approved'
    },
    {
      initials: 'JC',
      name: 'Jagdeep Chawla',
      role: 'Delivery Approval',
      instruction: 'Please review delivery commitments.',
      status: 'Awaiting Review'
    }
  ];


  constructor() { }

  ngOnInit(): void {
  }



}
