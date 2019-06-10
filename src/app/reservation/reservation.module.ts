import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationNewComponent } from './reservation-new/reservation-new.component';
import { RouterModule } from '@angular/router';
import { ReservationService } from '../services/reservation.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

@NgModule({
  declarations: [ReservationComponent, ReservationListComponent, ReservationNewComponent],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    NgbModule,
    ReactiveFormsModule,
  ],
  exports: [
  ],
  providers: [
    ReservationService,
  ]
})
export class ReservationModule {
  constructor() {
    library.add(faCalendar);
  }
}
