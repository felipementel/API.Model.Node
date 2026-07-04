import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createApp } from './app.js';

const OUTPUT_DIR = resolve('open-api');
const OUTPUT_FILE = resolve(OUTPUT_DIR, 'openapi.json');

const app = await createApp();
await app.ready();

// app.swagger() is injected by @fastify/swagger after registration
const spec = (app as unknown as { swagger(): unknown }).swagger();

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, JSON.stringify(spec, null, 2));

await app.close();

console.log(`✅ OpenAPI spec written to ${OUTPUT_FILE}`);
