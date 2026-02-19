'use strict';

const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1200;

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function hasGeneratedPrismaClient(cwd) {
    const clientDir = path.join(cwd, 'node_modules', '.prisma', 'client');
    const requiredFiles = ['index.js', 'default.js', 'index.d.ts'];

    return requiredFiles.every((file) => fs.existsSync(path.join(clientDir, file)));
}

function clearTmpEngineFiles(cwd) {
    const clientDir = path.join(cwd, 'node_modules', '.prisma', 'client');
    if (!fs.existsSync(clientDir)) {
        return;
    }

    for (const fileName of fs.readdirSync(clientDir)) {
        if (fileName.startsWith('query_engine-') && fileName.includes('.tmp')) {
            try {
                fs.unlinkSync(path.join(clientDir, fileName));
            } catch {
                // Ignore temp-file cleanup failures caused by active file locks.
            }
        }
    }
}

function isWindowsEngineLock(output) {
    if (process.platform !== 'win32') {
        return false;
    }

    return /EPERM: operation not permitted, rename .*query_engine-windows\.dll\.node/i.test(output);
}

function runPrismaGenerate(cwd) {
    return new Promise((resolve) => {
        const isWindows = process.platform === 'win32';
        const child = isWindows
            ? spawn('npx prisma generate', {
                  cwd,
                  env: process.env,
                  shell: true
              })
            : spawn('npx', ['prisma', 'generate'], {
                  cwd,
                  env: process.env,
                  shell: false
              });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (chunk) => {
            const text = chunk.toString();
            stdout += text;
        });

        child.stderr.on('data', (chunk) => {
            const text = chunk.toString();
            stderr += text;
        });

        child.on('error', (error) => {
            const text = error.message || String(error);
            stderr += `${text}\n`;
            resolve({ code: 1, output: `${stdout}${stderr}`, stdout, stderr });
        });

        child.on('close', (code) => {
            resolve({ code: code ?? 1, output: `${stdout}${stderr}`, stdout, stderr });
        });
    });
}

async function main() {
    const cwd = process.cwd();

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
        const result = await runPrismaGenerate(cwd);

        if (result.code === 0) {
            if (result.stdout) {
                process.stdout.write(result.stdout);
            }
            if (result.stderr) {
                process.stderr.write(result.stderr);
            }
            clearTmpEngineFiles(cwd);
            return;
        }

        const windowsLock = isWindowsEngineLock(result.output);
        if (windowsLock && hasGeneratedPrismaClient(cwd)) {
            console.warn(
                '[prisma-generate-safe] Windows locked Prisma engine file is in use by another process. ' +
                    'Continuing because a generated Prisma client already exists.'
            );
            clearTmpEngineFiles(cwd);
            return;
        }

        if (windowsLock && attempt < MAX_RETRIES) {
            const nextAttempt = attempt + 1;
            console.warn(
                `[prisma-generate-safe] Retrying prisma generate (${nextAttempt}/${MAX_RETRIES}) after engine lock...`
            );
            await sleep(BASE_RETRY_DELAY_MS * attempt);
            continue;
        }

        if (result.stdout) {
            process.stdout.write(result.stdout);
        }
        if (result.stderr) {
            process.stderr.write(result.stderr);
        }
        process.exitCode = result.code || 1;
        return;
    }

    process.exitCode = 1;
}

main().catch((error) => {
    console.error('[prisma-generate-safe] Unexpected failure:', error);
    process.exitCode = 1;
});
