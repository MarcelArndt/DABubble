import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadMembersMessageComponent } from './thread-members-message.component';

describe('ThreadMembersMessageComponent', () => {
  let component: ThreadMembersMessageComponent;
  let fixture: ComponentFixture<ThreadMembersMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadMembersMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadMembersMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
