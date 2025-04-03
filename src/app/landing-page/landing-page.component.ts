import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}  
   
  
    openInDashboard(route:string, path: string) {
      this.router.navigate([`/${route}`], { queryParams: { url: path } });
    }

}
