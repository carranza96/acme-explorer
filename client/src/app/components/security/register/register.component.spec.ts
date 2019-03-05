import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [FormsModule,
        AngularFireModule.initializeApp({
          apiKey: 'AIzaSyA8naTY9wmeLyX0q4dcGHv-ge_tHpa23SY',
          authDomain: 'gettingstarted-project-c5fc4.firebaseapp.com',
          databaseURL: 'https://gettingstarted-project-c5fc4.firebaseio.com',
          projectId: 'gettingstarted-project-c5fc4',
          storageBucket: 'gettingstarted-project-c5fc4.appspot.com',
          messagingSenderId: '702802570195'
        })],
      providers: [AngularFireAuth]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
