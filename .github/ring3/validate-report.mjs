import { lstat, readFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

const MAX_REPORT_BYTES = 64 * 1024;
const REPORT_KEYS = [
  'areaSquareMeters',
  'material',
  'sheetAreaSquareMeters',
  'sheetCount',
  'version',
];

const validateReportArtifact = async path => {
  const parentMetadata = await lstat(dirname(path));
  if (!parentMetadata.isDirectory() || parentMetadata.isSymbolicLink()) {
    throw new Error('The report artifact must use a regular directory.');
  }
  const metadata = await lstat(path);
  if (!metadata.isFile() || metadata.isSymbolicLink()) {
    throw new Error('The report artifact must be a regular file.');
  }
  if (metadata.size < 2 || metadata.size > MAX_REPORT_BYTES) {
    throw new Error('The report artifact has an invalid size.');
  }

  const report = JSON.parse(await readFile(path, 'utf8'));
  if (!report || typeof report !== 'object' || Array.isArray(report)) {
    throw new Error('The report artifact must contain one JSON object.');
  }
  if (JSON.stringify(Object.keys(report).sort()) !== JSON.stringify(REPORT_KEYS)) {
    throw new Error('The report artifact has an unexpected field set.');
  }
  if (
    report.version !== 1 ||
    typeof report.material !== 'string' ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(report.material) ||
    !Number.isFinite(report.areaSquareMeters) ||
    report.areaSquareMeters < 0 ||
    !Number.isFinite(report.sheetAreaSquareMeters) ||
    report.sheetAreaSquareMeters <= 0 ||
    !Number.isSafeInteger(report.sheetCount) ||
    report.sheetCount < 0
  ) {
    throw new Error('The report artifact does not match the approved schema.');
  }
};

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(invokedPath).href) {
  const [path] = process.argv.slice(2);
  if (!path || process.argv.length !== 3) {
    process.stderr.write('Usage: node validate-report.mjs <path>\n');
    process.exitCode = 1;
  } else {
    validateReportArtifact(path).catch(error => {
      process.stderr.write(`${error instanceof Error ? error.message : 'Artifact validation failed.'}\n`);
      process.exitCode = 1;
    });
  }
}

export { validateReportArtifact };
