/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

// https://www.thecrag.com/en/article/grades
export default registerAs('boulder-b-scale', () => ({
  'B5.6': ['4'],
  'B5.7': ['4', '5'],
  'B5.8': ['5'],
  'B5.9': ['5', '6'],
  'B5.10': ['6', '7'],
  'B5.10+': ['8'],
  'B1-': ['8', '9'],
  'B1': ['9'],
  'B1+': ['10'],
  'B2-': ['11', '12'],
  'B2': ['13', '14'],
  'B2+': ['15', '16'],
  'B3': ['17', '18', '19']
}));
