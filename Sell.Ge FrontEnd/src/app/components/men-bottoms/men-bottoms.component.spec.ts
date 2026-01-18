import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenBottomsComponent } from './men-bottoms.component';

describe('MenBottomsComponent', () => {
  let component: MenBottomsComponent;
  let fixture: ComponentFixture<MenBottomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenBottomsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenBottomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
