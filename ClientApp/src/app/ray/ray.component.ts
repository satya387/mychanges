import { Component, OnInit, HostListener } from '@angular/core';
import { RayService, Job, JobResponse } from './ray.service';
import { Router } from '@angular/router';
import { ReferralPoliciesComponent } from './referral-policies/referral-policies.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ray',
  templateUrl: './ray.component.html',
  styleUrls: ['./ray.component.scss']
})
export class RayComponent implements OnInit {

 
  jobs: any[] = [];
  selectedJob: Job | null = null;
  selectedLocation: string = '';
  locations: string[] = [];
  titleFilter: string = '';

  constructor(private service: RayService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchAllJobs();
  }

  fetchAllJobs(): void {
    this.service.getAllJobDetails().subscribe((response: JobResponse) => {
      this.jobs = response.jobs;
      this.extractUniqueLocations(); 
    });
  }
  extractUniqueLocations(): void {
    const locationSet = new Set<string>();
    this.jobs.forEach(job => locationSet.add(job.location.name));
    this.locations = Array.from(locationSet).sort();
  }

  openJobDetails(jobId: number): void {
    console.log(jobId)
    this.service.getJobDetails(jobId).subscribe((jobDetails: Job) => {
      this.selectedJob = jobDetails;
    });
  }

  showMoreDetails(jobId: number): void {
    this.openJobDetails(jobId);
  }

  closeModal(): void {
    this.selectedJob = null;
  }
  getFilteredJobs() {
    return this.jobs.filter(job => {
        const matchesLocation = !this.selectedLocation || job.location.name === this.selectedLocation;
        const matchesTitle = !this.titleFilter || job.title.toLowerCase().includes(this.titleFilter.toLowerCase());
        return matchesLocation && matchesTitle;
    });
}
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTopButton = document.getElementById('scrollTopButton');
    if (window.pageYOffset > 300) {
      scrollTopButton.classList.add('show');
    } else {
      scrollTopButton.classList.remove('show');
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openPopup(): void {
    this.dialog.open(ReferralPoliciesComponent, {
      width: '250px',
    });
  }
}
