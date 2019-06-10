import { AbstractControl, ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export class DateValidators {

    static greaterThanOrEqualToTodaysDate(): ValidatorFn {
        return (c: AbstractControl): { [key: string]: boolean } | null => {

            if ( !!c.value && (moment().set({ 'year': c.value.year, 'month': c.value.month - 1, 'date': c.value.day }) < moment())) {
                return { 'greaterThan': true };
            }
            return null;
        };
    }
}
