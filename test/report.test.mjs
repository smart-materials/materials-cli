import assert from 'node:assert/strict';
import test from 'node:test';
import { buildMaterialReport } from '../src/report.mjs';

test('builds a stable material estimate report', () => {
  assert.deepEqual(
    buildMaterialReport({
      material: ' Recycled Kraft Paper ',
      areaSquareMeters: 12.1,
      sheetAreaSquareMeters: 2.5,
    }),
    {
      version: 1,
      material: 'recycled-kraft-paper',
      areaSquareMeters: 12.1,
      sheetAreaSquareMeters: 2.5,
      sheetCount: 5,
    }
  );
});
