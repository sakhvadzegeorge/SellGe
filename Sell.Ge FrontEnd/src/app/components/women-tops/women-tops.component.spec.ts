import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenTopsComponent } from './women-tops.component';

describe('WomenTopsComponent', () => {
  let component: WomenTopsComponent;
  let fixture: ComponentFixture<WomenTopsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WomenTopsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomenTopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
