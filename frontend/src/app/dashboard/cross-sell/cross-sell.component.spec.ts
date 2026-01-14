import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossSellComponent } from './cross-sell.component';

describe('CrossSellComponent', () => {
  let component: CrossSellComponent;
  let fixture: ComponentFixture<CrossSellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrossSellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrossSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
