import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadMyMessageComponent } from './thread-my-message.component';

describe('ThreadMyMessageComponent', () => {
  let component: ThreadMyMessageComponent;
  let fixture: ComponentFixture<ThreadMyMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadMyMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadMyMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
