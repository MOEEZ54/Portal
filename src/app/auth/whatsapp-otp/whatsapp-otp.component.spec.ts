import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsappOtpComponent } from './whatsapp-otp.component';

describe('WhatsappOtpComponent', () => {
  let component: WhatsappOtpComponent;
  let fixture: ComponentFixture<WhatsappOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhatsappOtpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WhatsappOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
