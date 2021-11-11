import { Sector } from './sector.enum';
import { Type } from './type.enum';

export class ProfileFilter {
  page: number = 1;
  location?: Sector;
  type?: Type;
  rating?: Sorting;
  price?: Sorting;
}

export enum Sorting {
  asc = 'ASC',
  desc = 'DESC',
}
