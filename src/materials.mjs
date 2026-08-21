const normalizeMaterialName = value =>
  value
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '');

const estimateSheetCount = ({ areaSquareMeters, sheetAreaSquareMeters }) => {
  if (!Number.isFinite(areaSquareMeters) || areaSquareMeters < 0) {
    throw new Error('area must be a non-negative number');
  }
  if (!Number.isFinite(sheetAreaSquareMeters) || sheetAreaSquareMeters <= 0) {
    throw new Error('sheet area must be positive');
  }
  return Math.ceil(areaSquareMeters / sheetAreaSquareMeters);
};

export { estimateSheetCount, normalizeMaterialName };
