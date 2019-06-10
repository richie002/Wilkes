/* Reservation entity */
export interface Reservation {
     id: string;
     firstName: string;
     lastName: string;
     numberOfPeople: number;
     reservationDate: string;
     reservationTime: string;
     reservationFulfilled: boolean;
}
