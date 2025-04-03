import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPage1Component } from './demo-page-1.component';

describe('DemoPage1Component', () => {
  let component: DemoPage1Component;
  let fixture: ComponentFixture<DemoPage1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoPage1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
