import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedModule } from "../shared/shared.module";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  url: SafeResourceUrl | undefined;

  constructor(private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const url = params['url'] || 'https://example.com';
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    });
  }
}
