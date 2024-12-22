/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

// https://www.thecrag.com/en/article/grades
export default registerAs('boulder-s-scale', () => ({
  'S1-': ['7'],
  'S1': ['7'],
  'S1+': ['8'],
  'S2-': ['8'],
  'S2': ['9'],
  'S2+': ['9'],
  'S3-': ['10'],
  'S3': ['10'],
  'S3+': ['11'],
  'S4-': ['12'],
  'S4': ['12', '13'],
  'S4+': ['13'],
  'S5-': ['14'],
  'S5': ['15'],
  'S5+': ['15', '16'],
  'S6-': ['16'],
  'S6S6': ['17'],
  'S6+': ['18'],
}));
