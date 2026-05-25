import * as fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/bg-\[#F5F0E6\]/g, 'bg-[#F5F0E6] dark:bg-slate-950');
code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
code = code.replace(/text-\[#1A1A2E\]/g, 'text-[#1A1A2E] dark:text-slate-100');
code = code.replace(/text-\[#666666\]/g, 'text-[#666666] dark:text-slate-400');
code = code.replace(/bg-\[#1A1A2E\]/g, 'bg-[#1A1A2E] dark:bg-slate-800');
code = code.replace(/bg-\[#FAFAFA\]/g, 'bg-[#FAFAFA] dark:bg-slate-900');
code = code.replace(/border-\[#1A1A2E\](\/\d+)?/g, 'border-[#1A1A2E]$1 dark:border-white$1');
code = code.replace(/ring-\[#F5F0E6\]/g, 'ring-[#F5F0E6] dark:ring-slate-950');
code = code.replace(/ring-white/g, 'ring-white dark:ring-slate-900');
code = code.replace(/border-gray-100/g, 'border-gray-100 dark:border-slate-800');
code = code.replace(/border-gray-200/g, 'border-gray-200 dark:border-slate-700');
code = code.replace(/text-gray-400/g, 'text-gray-400 dark:text-slate-500');

fs.writeFileSync('src/App.tsx', code);
