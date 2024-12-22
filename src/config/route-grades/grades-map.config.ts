import { registerAs } from '@nestjs/config';

// TODO: cover all variants based on the ewbanks system
// https://www.thecrag.com/en/article/grades
export default registerAs('gradesMap', () => [
  {
    yds: [],
    nccs: ['F4'],
    french: ['1a', '1a+'],
    british: ['1a'],
    uiaa: ['1-'],
    newAfrican: ['1'],
    oldAfrican: ['A1', 'A2'],
    saxon: ['1'],
    finish: ['1-'],
    norwegian: ['1-'],
    polish: ['I-'],
    brazil: ['I'],
    swedish: ['1-'],
    russian: ['1A'],
  },
]);
