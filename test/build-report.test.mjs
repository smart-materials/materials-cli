import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const execute = promisify(execFile);

test('writes the approved report artifact', async () => {
  const outputRoot = await mkdtemp(join(tmpdir(), 'materials-report-'));
  const outputPath = join(outputRoot, 'report.json');

  try {
    await execute(process.execPath, ['scripts/build-report.mjs', '--output', outputPath]);
    const report = JSON.parse(await readFile(outputPath, 'utf8'));
    assert.deepEqual(report, {
      version: 1,
      material: 'recycled-kraft-paper',
      areaSquareMeters: 12.1,
      sheetAreaSquareMeters: 2.5,
      sheetCount: 5,
    });
  } finally {
    await rm(outputRoot, { force: true, recursive: true });
  }
});
