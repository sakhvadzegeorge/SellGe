import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenTopsComponent } from './men-tops.component';

describe('MenTopsComponent', () => {
  let component: MenTopsComponent;
  let fixture: ComponentFixture<MenTopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenTopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenTopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
