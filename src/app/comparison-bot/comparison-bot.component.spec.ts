import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparisonBotComponent } from './comparison-bot.component';

describe('ComparisonBotComponent', () => {
  let component: ComparisonBotComponent;
  let fixture: ComponentFixture<ComparisonBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparisonBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
