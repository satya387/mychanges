import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ray_URLS } from './ray.url-config';
/*import { JobResponse } from './customer-value-add-routing.model';*/


@Injectable({
  providedIn: 'root'
})
export class RayService {
  constructor(private http: HttpClient) { } 

  getAllJobDetails() {
    debugger;
    return this.http.get(Ray_URLS.GET_ALL_Job_DETAILS);
  }
getJobDetails(jobId: number): Observable<Job> {
  const url = `${Ray_URLS.GET_Job_DETAILS}${jobId}`;
  console.log('Requesting URL:', url); // Add this line for debugging
  return this.http.get<Job>(url);
}
}

export interface DataCompliance {
  type: string;
  requires_consent: boolean;
  requires_processing_consent: boolean;
  requires_retention_consent: boolean;
  retention_period: string | null;
}

export interface Location {
  name: string;
}

export interface Metadata {
  id: number;
  name: string;
  value: string | null;
  value_type: string;
}

export interface Job {
  absolute_url: string;
  data_compliance: DataCompliance[];
  internal_job_id: number;
  location: Location;
  metadata: Metadata[];
  id: number;
  updated_at: string;
  requisition_id: string;
  title: string;
  content: string; // Assuming the content is part of the Job interface
}

export interface JobResponse {
  jobs: Job[];
}


