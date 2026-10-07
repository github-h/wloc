import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Vercel 适配目录必须自包含：部署时只有 vercel/node_modules 可用，
// Node 解析不会横向找 worker/node_modules，因此把 worker/src 原样复制进 vercel/src。
const root = fileURLToPath(new URL('../', import.meta.url));
const SRC = path.join(root, 'worker', 'src');
const DEST = path.join(root, 'vercel', 'src');

export async function syncedFiles() {
  const files = new Map();
  for (const name of await readdir(SRC)) {
    if (!name.endsWith('.js')) continue;
    const content = await readFile(path.join(SRC, name), 'utf8');
    files.set(name, content.replaceAll('\r\n', '\n'));
  }
  return files;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const files = await syncedFiles();
  await mkdir(DEST, { recursive: true });
  for (const [name, content] of files) await writeFile(path.join(DEST, name), content);
  console.log(`已同步 ${files.size} 个文件到 vercel/src/；该目录由本脚本生成，请勿直接编辑。`);
}
