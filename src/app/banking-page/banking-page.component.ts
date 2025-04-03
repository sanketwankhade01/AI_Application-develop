import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-banking-page',
  templateUrl: './banking-page.component.html',
  styleUrls: ['./banking-page.component.scss']
})
export class BankingPageComponent implements OnInit {
  headerName: string | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.headerName = params['header'] || 'Banking';
    });
  }

  openInDashboard(route:string, path: string) {
    this.router.navigate([`/${route}`], { queryParams: { url: path } });
  }
}
