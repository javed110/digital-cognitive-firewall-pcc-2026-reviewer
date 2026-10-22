import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {analyze,MAX_MESSAGE} from '../app/analyzer.mjs';
const cases=JSON.parse(await fs.readFile(new URL('./cases.json',import.meta.url),'utf8'));
const rows=[];
for (const c of cases) {
 try {const actual=analyze(c);assert.equal(actual.category,c.category);for(const x of c.technical??[])assert(actual.technical.some(t=>t.id===x));assert(!('score' in actual));assert(!('probability' in actual));rows.push({id:c.id,purpose:c.purpose,passed:true,actual});}
 catch(e){rows.push({id:c.id,passed:false,error:e.message});}
}
for(const [id,input] of [['B01',{message:''}],['B02',{message:'a'.repeat(MAX_MESSAGE+1)}],['B03',{message:'hello',expectedDomain:'https://example.org/path'}],['B04',{message:4}]]) {
 try{assert.throws(()=>analyze(input));rows.push({id,passed:true,purpose:'Reject invalid input'});}catch(e){rows.push({id,passed:false,error:e.message});}
}
const report={run_at:new Date().toISOString(),kind:'Synthetic policy and boundary regression checks',passed:rows.filter(x=>x.passed).length,total:rows.length,limits:'Author-defined expectations. No blinded evaluation, detection accuracy, human benefit or trained model performance is measured.',rows};
await fs.mkdir(new URL('../evidence/',import.meta.url),{recursive:true});await fs.writeFile(new URL('../evidence/regression-results.json',import.meta.url),JSON.stringify(report,null,2));
console.log(JSON.stringify({passed:report.passed,total:report.total,failures:rows.filter(x=>!x.passed)}));if(report.passed!==report.total)process.exitCode=1;
