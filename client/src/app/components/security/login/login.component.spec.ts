import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { TranslateModule} from '@ngx-translate/core';
import { LoginComponent } from './login.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [FormsModule,
        TranslateModule.forRoot({}),
        AngularFireModule.initializeApp({
          apiKey: 'AIzaSyA8naTY9wmeLyX0q4dcGHv-ge_tHpa23SY',
          authDomain: 'gettingstarted-project-c5fc4.firebaseapp.com',
          databaseURL: 'https://gettingstarted-project-c5fc4.firebaseio.com',
          projectId: 'gettingstarted-project-c5fc4',
          storageBucket: 'gettingstarted-project-c5fc4.appspot.com',
          messagingSenderId: '702802570195'
        })
      ],
      providers: [AngularFireAuth]
    })
    .compileComponents();
  }));

  // imports: [
  //   BrowserModule,
  //   FormsModule,
  //   AngularFontAwesomeModule,
  //   AngularFireModule.initializeApp(firebaseConfig),
  //   CollapseModule.forRoot(),
  //   BsDropdownModule.forRoot(),
  //   HttpClientModule,
  //   TranslateModule.forRoot({
  //     loader: {
  //       provide: TranslateLoader,
  //       useFactory: HttpLoaderFactory,
  //       deps: [HttpClient]
  //     }
  //   }),
  //   AppRoutingModule
  // ],

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
