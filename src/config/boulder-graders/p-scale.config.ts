/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

// https://www.thecrag.com/en/article/grades
export default registerAs('boulder-p-scale', () => ({
  'P0': ['4'],
  'P1': ['4', '5'],
  'P2': ['5', '6'],
  'P3': ['6'],
  'P4': ['7'],
  'P5': ['8'],
  'P6': ['9'],
  'P7': ['10'],
  'P8': ['11', '12'],
  'P9': ['12', '13'],
  'P10': ['14', '15'],
  'P11': ['15', '16'],
  'P12': ['17'],
  'P13': ['18'],
  'P14': ['19'],
  'P15': ['20'],
  'P16': ['21'],
}));
