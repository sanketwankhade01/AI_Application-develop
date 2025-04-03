import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoPage2Component } from './demo-page-2.component';

describe('DemoPage2Component', () => {
  let component: DemoPage2Component;
  let fixture: ComponentFixture<DemoPage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemoPage2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemoPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
