import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { buildMaterialReport } from '../src/report.mjs';

const [outputFlag, outputPath] = process.argv.slice(2);
if (outputFlag !== '--output' || !outputPath || process.argv.length !== 4) {
  process.stderr.write('Usage: node scripts/build-report.mjs --output <path>\n');
  process.exitCode = 1;
} else {
  const report = buildMaterialReport({
    material: 'Recycled Kraft Paper',
    areaSquareMeters: 12.1,
    sheetAreaSquareMeters: 2.5,
  });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', flag: 'w' });
}
