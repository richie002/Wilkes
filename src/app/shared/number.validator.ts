import { AbstractControl, ValidatorFn } from '@angular/forms';

export class NumberValidators {

  static greaterThan(minValue: number): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (c.value && (isNaN(c.value) || (c.value < minValue) )) {
        return { 'greaterThan': true };
      }
      return null;
    };
  }
}
