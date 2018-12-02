import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfsComponent } from './bfs.component';

describe('BfsComponent', () => {
  let component: BfsComponent;
  let fixture: ComponentFixture<BfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
