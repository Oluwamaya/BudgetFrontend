import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaybudgetComponent } from './displaybudget.component';

describe('DisplaybudgetComponent', () => {
  let component: DisplaybudgetComponent;
  let fixture: ComponentFixture<DisplaybudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaybudgetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DisplaybudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
