import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Reservation } from '../types/reservation';
import { SampleData } from './sampleData';

@Injectable({ providedIn: 'root' })
export class ReservationService {
    sampleData: Reservation[] = SampleData;
    localStorage = window.localStorage;

    constructor() {
        this.storeSampleDataToLocalStorage();
    }

    storeSampleDataToLocalStorage(): void {
        this.sampleData.map(item => this.localStorage.setItem(item.id, JSON.stringify(item)));
    }

    getAll(): Reservation[] {

        let reservations: Reservation[] = [];

        for (let index = 0; index < this.localStorage.length; index++) {
            let key = localStorage.key(index);
            let value = JSON.parse(localStorage.getItem(key));

            reservations.push(value);
        }
        return reservations;
    }

    get(id: string): Observable<Reservation> {
        if (!id) {
            return of(this.initialize());
        }

        return of(JSON.parse(localStorage.getItem(id)))
            .pipe(
                tap(data => console.log('getReserervation: ' + JSON.stringify(data))),
                catchError(this.handleError)
            );
    }

    create(reservation: Reservation): Observable<Reservation> {
        reservation.id = this.uuid();
        const index =  this.localStorage.setItem(reservation.id, JSON.stringify(reservation));
        return this.get(reservation.id);
    }

    update(reservation: Reservation): Observable<Reservation> {

        this.localStorage.setItem( reservation.id, JSON.stringify(reservation));
        return this.get(reservation.id);
    }

    delete(id: string): Observable<{}> {
        this.localStorage.removeItem(id);
        return of({});
    }

    private handleError(err) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage: string;
        if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
        console.error(err);
        return throwError(errorMessage);
    }

    private initialize(): Reservation {
        // Return an initialized object
        return {
            id: '',
            firstName: null,
            lastName: null,
            numberOfPeople: null,
            reservationDate: null,
            reservationTime: null,
            reservationFulfilled: false,
        };
    }

    private uuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}
