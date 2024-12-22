/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

// https://www.thecrag.com/en/article/grades
export default registerAs('boulder-v-scale', () => ({
  'VB-': ['1'],
  'VB': ['2'],
  'VB+': ['3'],
  'V0-': ['4'],
  'V0': ['5'],
  'V0+': ['6'],
  'V1': ['7'],
  'V2': ['8'],
  'V3': ['9'],
  'V4': ['10'],
  'V5': ['11'],
  'V6': ['12'],
  'V7': ['13'],
  'V8': ['14'],
  'V9': ['15'],
  'V10': ['16'],
  'V11': ['17'],
  'V12': ['18'],
  'V13': ['19'],
  'V14': ['20'],
  'V15': ['21'],
  'V16': ['22'],
  'V17': ['23'],
}));
