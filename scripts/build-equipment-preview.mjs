import { spawnSync } from 'node:child_process';
const result=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['run','build'],{
  stdio:'inherit',shell:process.platform==='win32',
  env:{...process.env,PUBLIC_LOCAL_PREVIEW:'true',PUBLIC_QUOTE_REQUEST_SUBMISSION_ENABLED:'false',PUBLIC_QUOTE_REQUEST_ENDPOINT:''},
});
process.exit(result.status??1);
