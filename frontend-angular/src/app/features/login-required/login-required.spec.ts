import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRequired } from './login-required';

describe('LoginRequired', () => {
  let component: LoginRequired;
  let fixture: ComponentFixture<LoginRequired>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginRequired],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginRequired);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
