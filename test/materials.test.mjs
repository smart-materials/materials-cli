import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateSheetCount, normalizeMaterialName } from '../src/materials.mjs';

test('normalizes a material name for a stable report key', () => {
  assert.equal(normalizeMaterialName('  Recycled   Kraft Paper  '), 'recycled-kraft-paper');
});

test('rounds a positive sheet estimate up to the next whole sheet', () => {
  assert.equal(estimateSheetCount({ areaSquareMeters: 12.1, sheetAreaSquareMeters: 2.5 }), 5);
});

test('rejects a non-positive sheet area', () => {
  assert.throws(
    () => estimateSheetCount({ areaSquareMeters: 12, sheetAreaSquareMeters: 0 }),
    /sheet area must be positive/
  );
});
