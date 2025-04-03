import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingPageComponent } from './banking-page.component';

describe('BankingPageComponent', () => {
  let component: BankingPageComponent;
  let fixture: ComponentFixture<BankingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
