import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertModuleService } from '../alert-module.service';
import { ToastService } from 'src/app/common/toast/toast.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
interface EsclationActionTaken {
  RecordType?: string;
  EscalationManagementId?: number;
  Title?: string;
  Description?: string;
  CommentGiven?: string;
  TimelineDate?: Date | string | null;      // API returns datetime string
  EventCreatedDate?: string;    // API returns datetime string
  SortOrder?: number;
  DisplayDetails?: number;
  EscalationType?: string;
  EscalationPriority?: string;
  EscalationCategory?:string;
  TargetResolutionDate?: Date | string | null;
  Status?: string | null;
  ActionTakenBy?: string | null;
  EscalatedBy?: string | null;
  EscalationPriorityId?: number 
  // add any other fields you need
}
@Component({
  selector: 'app-action-alert',
  templateUrl: './action-alert.component.html',
  styleUrls: ['./action-alert.component.scss']
})
export class ActionAlertComponent implements OnInit {
  commentText: string = '';
  isClosed: boolean = false;
  EscalationManagementId: number | null = null;
  submitting = false;
  TimeLineList: EsclationActionTaken[] = [];
  filteredDta: any;
  isTimelineClosed: boolean = false;
  showValidation = false;

  constructor(private http: HttpClient,private alertModuleService: AlertModuleService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const id = params['id'];
      this.EscalationManagementId = id ? +id : null;
    });
    this.GetTimeLineList();
  }
  GetTimeLineList(): void {
    const EscalationManagementId = this.EscalationManagementId;
    if (EscalationManagementId == null) {
      this.TimeLineList = [];
      console.debug('GetTimeLineList: no EscalationManagementId');
      return;
    }
  
    const toISO = (raw?: string | null) => {
      if (!raw) return null;
      // Some responses are like "11/25/2025 08:40:51"
      // Try Date parsing first (most browsers accept "MM/DD/YYYY hh:mm:ss")
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString(); // ISO string that Angular date pipe can parse reliably
      }
      // fallback: replace space with 'T' (may or may not work depending on browser)
      const t = raw.replace(' ', 'T');
      const p2 = new Date(t);
      if (!isNaN(p2.getTime())) return p2.toISOString();
      // last resort return raw
      return raw;
    };
  
    this.alertModuleService.GetTimeLineListbyId(EscalationManagementId).subscribe({
      next: (response: any) => {
        console.log('GetTimeLineList: API response', response);
  
        // extract array if wrapped in { data: [...] } or returned directly as [...]
        const arr = Array.isArray(response) ? response : (response?.data ?? []);
  
        // Normalize each item so template can use PascalCase names (TimelineDate, RecordType, CommentGiven, Description)
        this.TimeLineList = arr.map((it: any) => {
          const timelineRaw = it.timelineDate ?? it.TimelineDate ?? it.eventCreatedDate ?? it.EventCreatedDate;
          const eventRaw = it.eventCreatedDate ?? it.EventCreatedDate;
         const parsedTimeline = this.parseToDateAsUTC(timelineRaw);
           const parsedEvent = this.parseToDateAsUTC(eventRaw);
           console.log('raw timeline:', timelineRaw, '=> parsed:', parsedTimeline?.toString(), 'iso:', parsedTimeline?.toISOString(), 'offsetMin:', parsedTimeline?.getTimezoneOffset());
          return {
            // keep original properties too if you want
            ...it,
            // PascalCase aliases your template expects:
            RecordType: it.recordType ?? it.RecordType ?? it.RecordType,
            Title: it.title ?? it.Title,
            Description: it.description ?? it.Description,
            CommentGiven: it.commentGiven ?? it.CommentGiven,
            TimelineDate: this.parseToDateAsUTC(timelineRaw),
            EventCreatedDate: this.parseToDateAsUTC(eventRaw),
            DisplayDetails:
  typeof (it.displayDetails ?? it.DisplayDetails) === 'boolean'
    ? ((it.displayDetails ?? it.DisplayDetails) ? 1 : 0)
    : (it.displayDetails ?? it.DisplayDetails ?? 0),
            EscalationType: it.escalationType ?? it.EscalationType,
            EscalationPriority: it.escalationPriority ?? it.EscalationPriority,
            EscalationCategory: it.escalationCategory ?? it.EscalationCategory,
            TargetResolutionDate: it.targetResolutionDate ?? it.TargetResolutionDate,
            EscalationManagementId: it.escalationManagementId ?? it.EscalationManagementId,
            SortOrder: it.sortOrder ?? it.SortOrder ?? 0,
            Status: it.status ?? it.Status, 
            ActionTakenBy: it.actionTakenBy ?? it.ActionTakenBy,
            EscalatedBy: it.escalatedBy ?? it.EscalatedBy,
            EscalationPriorityId: it.escalationPriorityId ?? it.EscalationPriorityId,
          } as EsclationActionTaken;
        });
  
        // Sort by TimelineDate (oldest → newest). If TimelineDate is non-ISO string, the mapper converts when possible.
        this.TimeLineList.sort((a, b) => {
          const ta = a.TimelineDate ? new Date(a.TimelineDate).getTime() : 0;
          const tb = b.TimelineDate ? new Date(b.TimelineDate).getTime() : 0;
          return ta - tb;
        });
        this.enableDisableCommentSection();
        console.debug('GetTimeLineList: TimeLineList', this.TimeLineList);
      },
      error: (error: any) => {
        console.error('GetTimeLineList error', error);
        this.toastService.showError(error, 'Error');
      }
    });
  }  
  submitForm() {
    if (this.submitting) { return; }
    this.showValidation = true;  
    this.submitting = true;
  
    const comments = this.commentText?.trim() || null;
  
    if (!comments) {
      this.toastService.showError('Please enter all mandatory fields.', 'Validation');
      this.submitting = false;
      return;
    }
  
    const isMarked = this.isClosed ? 1 : 0;
    const EscalationManagementId = this.EscalationManagementId;
  
    if (EscalationManagementId == null) {
      this.toastService.showError('Escalation ID missing', 'Error');
      this.submitting = false;
      return;
    }
  
    this.alertModuleService.SubmitComments(isMarked, comments, EscalationManagementId).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess('Comments submitted successfully', 'Success');
        this.commentText = '';
        this.isClosed = false;
        this.submitting = false;
        this.showValidation = false;  
  
        this.GetTimeLineList();
      },
      error: (err: any) => {
        console.error('Update failed', err);
        this.toastService.showError('Failed to submit Comments', 'Error');
        this.submitting = false;
      }
    });
  }
  

  goBack() {
    this.router.navigate(['/alert-module']);
  }
  // treat 'MM/DD/YYYY hh:mm:ss' as UTC
private parseToDateAsUTC(raw?: string | null): Date | null {
  if (!raw) return null;
  const s = raw.trim();

  // if format is MM/DD/YYYY or YYYY-MM-DD variants then build safely
  // here we handle "MM/DD/YYYY hh:mm:ss"
  const mmdd = /^(\d{1,2})\/(\d{1,2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/;
  const m = s.match(mmdd);
  if (m) {
    // create ISO with Z so JS treats as UTC
    // month/day -> yyyy-mm-dd
    const month = m[1].padStart(2, '0');
    const day = m[2].padStart(2, '0');
    const year = m[3];
    const isoUTC = `${year}-${month}-${day}T${m[4]}:${m[5]}:${m[6]}Z`;
    const d = new Date(isoUTC);
    return isNaN(d.getTime()) ? null : d;
  }

  // fallback: if already ISO-like with TZ let Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  console.log('parsed local:', d?.toString());        // e.g. "Fri Dec 05 2025 11:48:28 GMT+0530 (IST)"
console.log('parsed iso:', d?.toISOString());  

  return null;
}
getPriorityClass(priorityId?: number): string {
  switch (priorityId) {
    case 4: return 'priority-low';        // Low
    case 3: return 'priority-medium';     // Medium
    case 2: return 'priority-high';       // High
    case 1: return 'priority-critical';   // Critical
    default: return '';
  }
}

enableDisableCommentSection() {
  this.filteredDta = this.TimeLineList.filter(e =>
    (e.Status || '').toLowerCase() === 'closed'
  );
  this.isTimelineClosed = this.filteredDta.length > 0;

  console.log('Filtered Closed Records:', this.isTimelineClosed);
  console.log('Filtered Closed Records:', this.filteredDta);
}
isInvalid(field: string): boolean {
  if (field === 'commentText') {
    return this.showValidation && (!this.commentText || this.commentText.trim().length === 0);
  }
  return false;
}

}
