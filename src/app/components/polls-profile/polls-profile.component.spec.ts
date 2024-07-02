import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollsProfileComponent } from './polls-profile.component';

describe('PollsProfileComponent', () => {
  let component: PollsProfileComponent;
  let fixture: ComponentFixture<PollsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PollsProfileComponent]
    });
    fixture = TestBed.createComponent(PollsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
