import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit {

  reservations: any;
  displayedColumns: string[] = ['firstName', 'lastName', 'numberOfPeople', 'reservationDate', 'reservationTime', 'reservationFulfilled'];

  constructor(private reservationService: ReservationService) {
   
  }

  ngOnInit() {

    this.reservations = this.reservationService.getAll();
  }

}