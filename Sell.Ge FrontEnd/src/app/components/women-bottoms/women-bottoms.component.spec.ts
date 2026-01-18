import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WomenBottomsComponent } from './women-bottoms.component';

describe('WomenBottomsComponent', () => {
  let component: WomenBottomsComponent;
  let fixture: ComponentFixture<WomenBottomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WomenBottomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WomenBottomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
