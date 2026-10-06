import { Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-more-details',
  templateUrl: './more-details.component.html',
  styleUrls: ['./more-details.component.scss']
})
export class MoreDetailsComponent implements OnInit,  OnChanges {
  @Input() job: any;
  jobDetailsContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.updateJobDetailsContent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.job && !changes.job.firstChange) {
      this.updateJobDetailsContent();
    }
  }

  updateJobDetailsContent(): void {
    this.jobDetailsContent = this.getTextFromHTML(this.job?.content || '');
    console.log(this.jobDetailsContent);
  }

  getTextFromHTML(html: string): string {
    const parser = new DOMParser();
    const parsedHtml = parser.parseFromString(html, 'text/html');
    return parsedHtml.body.textContent || '';
  }

  close(): void {
    this.job = null;
  }

}
