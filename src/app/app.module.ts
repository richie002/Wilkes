import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './header/header.component';
import { ReservationModule } from './reservation/reservation.module';
import { ReservationRoutingModule } from './reservation/reservation-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReservationModule,
    ReservationRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
 
 }
