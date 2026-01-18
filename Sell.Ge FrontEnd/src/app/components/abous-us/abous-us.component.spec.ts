import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbousUsComponent } from './abous-us.component';

describe('AbousUsComponent', () => {
  let component: AbousUsComponent;
  let fixture: ComponentFixture<AbousUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbousUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbousUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
