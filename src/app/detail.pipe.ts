import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'detail'
})
export class DetailPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
