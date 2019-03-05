import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Actor } from '../../../model/actor.model';
import { ActorService } from '../../../services/actor.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './editProfile.component.html',
  styleUrls: ['./editProfile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  actor: Actor;
  errorMessage: string;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private actorService: ActorService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.actor = new Actor();

    this.profileForm = this.fb.group({
      id: [''],
      name: [''],
      surname: ['']
    });

    this.actor = new Actor();

    this.authService.getCurrentActor().then(
      (actorData: Actor) => {
        if (actorData) {
          this.actor = actorData;
          this.profileForm.controls['id'].setValue(this.actor._id);
          this.profileForm.controls['name'].setValue(this.actor.name);
          this.profileForm.controls['surname'].setValue(this.actor.surname);
        } else {
          console.log('error getting current actor: ' + JSON.stringify(actorData));
        }
      }).catch(err => console.log(err));
  }

  onSubmit() {
    const formModel = this.profileForm.value;

    this.actor.name = formModel.name;
    this.actor.surname = formModel.surname;

    this.authService.getCurrentActor().then(actor => {
      this.actorService.updateProfile(this.actor).then((val) => {
        this.errorMessage = 'Profile successfully updated for actor with id: ' + this.actor._id;
      }).catch((err) => { this.errorMessage = err.statusText; console.error(err); });
    });

  }


}
