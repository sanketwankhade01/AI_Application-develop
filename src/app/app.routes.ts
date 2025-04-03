import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { BankingPageComponent } from './banking-page/banking-page.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DemoPage1Component } from './demo-page-1/demo-page-1.component';
import { DemoPage2Component } from './demo-page-2/demo-page-2.component';
import { ComparisonBotComponent } from './comparison-bot/comparison-bot.component';

export const routes: Routes = [
    { path: '', component: LoginComponent},
    { path: 'landing', component: LandingPageComponent },
    { path: 'banking', component: BankingPageComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'demo1', component: DemoPage1Component },
    { path: 'demo2', component: DemoPage2Component },
    { path: 'comparison-bot', component: ComparisonBotComponent }
];
