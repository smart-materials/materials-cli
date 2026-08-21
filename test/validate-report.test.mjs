import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { validateReportArtifact } from '../.github/ring3/validate-report.mjs';

const validReport = {
  version: 1,
  material: 'recycled-kraft-paper',
  areaSquareMeters: 12.1,
  sheetAreaSquareMeters: 2.5,
  sheetCount: 5,
};

test('accepts one bounded regular JSON report', async () => {
  const root = await mkdtemp(join(tmpdir(), 'materials-report-validation-'));
  try {
    const reportPath = join(root, 'report.json');
    await writeFile(reportPath, JSON.stringify(validReport));
    await assert.doesNotReject(validateReportArtifact(reportPath));
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('rejects a symbolic-link report', async () => {
  const root = await mkdtemp(join(tmpdir(), 'materials-report-validation-'));
  try {
    const targetPath = join(root, 'target.json');
    const reportRoot = join(root, 'ring3-output');
    const reportPath = join(reportRoot, 'report.json');
    await mkdir(reportRoot);
    await writeFile(targetPath, JSON.stringify(validReport));
    await symlink(targetPath, reportPath);
    await assert.rejects(validateReportArtifact(reportPath), /regular file/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

test('rejects a report below a symbolic-link directory', async () => {
  const root = await mkdtemp(join(tmpdir(), 'materials-report-validation-'));
  try {
    const targetRoot = join(root, 'target');
    const reportRoot = join(root, 'ring3-output');
    await mkdir(targetRoot);
    await writeFile(join(targetRoot, 'report.json'), JSON.stringify(validReport));
    await symlink(targetRoot, reportRoot);
    await assert.rejects(validateReportArtifact(join(reportRoot, 'report.json')), /regular directory/);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});
