import { HttpClient, HttpParams, HttpResponse, HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Segment_URL } from './segment-dashboard.url-config';

@Injectable({
  providedIn: 'root',
})
export class SegmentDashboardService {
  constructor(private http: HttpClient) {}

//   private sGAReportSubject = new BehaviorSubject<any>({});

//   sGAReport$ = this.sGAReportSubject.asObservable();

//   updateSgaReport(data: any) {
//     this.sGAReportSubject.next(data);
//   }

  getAccountsByEmpId() {
    return this.http.get(Segment_URL.GET_SEGMENT_ALL_ACCOUNTS_BY_EMP_ID);
  }
  getSegmentsByEmpId() {
    return this.http.get(Segment_URL.GET_SEGMENT_ALL_SEGMENTS_BY_EMP_ID);
  }
//   getSGAAccessByEmpemidsId() {
//     return this.http.get(SGA_URL.GET_SGA_ACCESSBY_EMPEMIDS_ID);
//   }


  getSegmentDashboardOverAllData(segmentObject: any) {
    return this.http.post(
        Segment_URL.GET_SEGMENT_DASHBOARD_OVERALL_DATA,
        segmentObject
    );
  }

  getSegmentDashboardDataBySegmentId(segmentObject: any) {
    return this.http.post(
        Segment_URL.GET_SEGMENT_DASHBOARD_DATA_BY_SEGMENT_ID,
        segmentObject
    );
  }

}
