import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { NumberValidators } from '../../shared/number.validator';
import { DateValidators } from '../../shared/date.validator';
import { GenericValidator } from '../../shared/generic.validator';
import { ReservationService } from '../../services/reservation.service';
import { Reservation } from '../../types/reservation';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

@Component({
  selector: 'app-reservation-new',
  templateUrl: './reservation-new.component.html',
  styleUrls: ['./reservation-new.component.scss']
})

export class ReservationNewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  pageTitle = 'Modify Reservation';
  errorMessage: string;
  reservationForm: FormGroup;
  reservation: Reservation;
  faCalendar = faCalendar;
  startOptions: any = { format: 'DD/MM/YYYY' };

  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  private idSubscription: Subscription;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService) {

    this.validationMessages = {
      firstName: {
        required: 'First name is required.',
        minlength: 'First name must be at least three characters.',
        maxlength: 'First name cannot exceed 50 characters.'
      },
      lastName: {
        required: 'Last name is required.',
        minlength: 'Last name must be at least three characters.',
        maxlength: 'Last name cannot exceed 50 characters.'
      },
      numberOfPeople: {
        required: 'Number Of People is required.',
        greaterThan: 'There must be at least one person dining.'
      },
      reservationDate: {
        required: 'Reservation Date is required.',
        greaterThan: 'Dining date has to be today or in the future.'
      },
      reservationTime: {
        required: 'Reservation Time is required.',
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {
    this.reservationForm = this.formBuilder.group({
      firstName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      lastName: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      numberOfPeople: ['', [Validators.required,
      NumberValidators.greaterThan(1)]],
      reservationDate: ['', [Validators.required,
      DateValidators.greaterThanOrEqualToTodaysDate()]],
      reservationTime: ['', [Validators.required]],
      reservationFulfilled: [],
    });

    this.idSubscription = this.route.paramMap.subscribe(
      params => {
        let id: string = params.get('id');
        this.getReservation(id);
      }
    );
  }

  ngOnDestroy(): void {
    this.idSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    merge(this.reservationForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(400)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.reservationForm);
    });
  }

  getReservation(id: string) {
    this.reservationService.get(id)
      .subscribe(
        (reservation: Reservation) => this.displayReservation(reservation),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayReservation(reservation: Reservation): void {

    if (this.reservationForm) {
      this.reservationForm.reset();
    }

    this.reservation = reservation;

    if (this.reservation.id === '') {
      this.pageTitle = 'Make New Reservation';
    } else {
      this.pageTitle = `Modify Reservation for ${this.reservation.firstName} ${this.reservation.lastName}`;
    }

    let pickerDate = null;

    if (!!this.reservation.reservationDate) {
      const reservationDate = moment(this.reservation.reservationDate);
      pickerDate = { year: reservationDate.year(), month: reservationDate.month() + 1, day: reservationDate.date() };
    }

    let pickerTime = null;

    if (!!this.reservation.reservationTime) {
      const reservationTime = this.reservation.reservationTime;
      pickerTime = { hour: parseInt(reservationTime.substring(0, 2)), minute: parseInt(reservationTime.substring(3)) };
    }


    this.reservationForm.patchValue({
      firstName: this.reservation.firstName,
      lastName: this.reservation.lastName,
      numberOfPeople: this.reservation.numberOfPeople,
      reservationDate: pickerDate,
      reservationTime: pickerTime,
      reservationFulfilled: this.reservation.reservationFulfilled,
    });
  }

  deleteReservation(): void {
    if (this.reservation.id === '') {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really cancel the reservation for ${this.reservation.firstName} ${this.reservation.lastName}?`)) {
        this.reservationService.delete(this.reservation.id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveReservation(): void {
    if (this.reservationForm.valid) {
      if (this.reservationForm.dirty) {
        let data = { ...this.reservation, ...this.reservationForm.value };
        const reservationDate = this.reservationForm.value.reservationDate;
        const reservationTime = this.reservationForm.value.reservationTime;
        const momentDate = moment().set({ 'year': reservationDate.year, 'month': reservationDate.month - 1, 'date': reservationDate.day, 'hour': reservationTime.hour, 'minute': reservationTime.minute });
        data.reservationDate = momentDate.format('YYYY-MM-DD');
        data.reservationTime = momentDate.format('HH:mm');

        if (data.id === '') {
          this.reservationService.create(data)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.reservationService.update(data)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.reservationForm.reset();
    this.router.navigate(['/reservation']);
  }
}
