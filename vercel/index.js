// Vercel 零配置 Hono 入口。Vercel 的检测器只匹配本文件中的裸包导入 "hono"
//（不识别 "hono/tiny" 等子路径），下一行请勿删除或改成子路径导入。
import "hono";
// src/ 是 worker/src 的同步副本，由 npm run sync:vercel 生成、npm run check 校验，请勿直接编辑。
export { default } from "./src/index.js";
