import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseModal } from './purchase-modal';

describe('PurchaseModal', () => {
  let component: PurchaseModal;
  let fixture: ComponentFixture<PurchaseModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
