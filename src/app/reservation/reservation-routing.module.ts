import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { ReservationNewComponent } from './reservation-new/reservation-new.component';

const routes: Routes = [
    {
        path: 'reservation',
        component: ReservationComponent,
        data: { title: 'Reservations' },
        children: [
            {
                path: '',
                component: ReservationListComponent,
                data: { title: 'List of Reservations' }
            },
            {
                path: 'edit/:id',
                component: ReservationNewComponent,
                data: { title: 'Modify Reservation' },
            },
            {
                path: 'new',
                component: ReservationNewComponent,
                data: { title: 'Add New Reservation' },
            }
        ]
    },
    { path: '**', component: ReservationListComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ReservationRoutingModule { }