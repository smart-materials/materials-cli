import { estimateSheetCount, normalizeMaterialName } from './materials.mjs';

const buildMaterialReport = input => ({
  version: 1,
  material: normalizeMaterialName(input.material),
  areaSquareMeters: input.areaSquareMeters,
  sheetAreaSquareMeters: input.sheetAreaSquareMeters,
  sheetCount: estimateSheetCount(input),
});

export { buildMaterialReport };
