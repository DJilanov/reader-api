/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

// https://www.thecrag.com/en/article/grades
export default registerAs('boulder-fountain-scale', () => ({
  // TODO
  'A-': ['7'],
  'A': ['8'],
  'A+': ['8', '9'],
  'B-': ['9'],
  'B': ['10'],
  'B+': ['11'],
  'C-': ['12', '13'],
  'C': ['13', '14'],
  'C+': ['14', '15'],
  'D-': ['15'],
  'D': ['16'],
  'D+': ['17'],
}));
