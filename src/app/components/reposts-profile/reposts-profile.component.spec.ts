import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepostsProfileComponent } from './reposts-profile.component';

describe('RepostsProfileComponent', () => {
  let component: RepostsProfileComponent;
  let fixture: ComponentFixture<RepostsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepostsProfileComponent]
    });
    fixture = TestBed.createComponent(RepostsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
