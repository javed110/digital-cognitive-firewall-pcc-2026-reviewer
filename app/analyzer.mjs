// Deterministic, inspectable teaching prototype. No trained model or URL lookup.
export const VERSION = '1.0.0';
export const MAX_MESSAGE = 12000;
export const RULES = [
  {id:'urgency',label:'Time pressure',re:/\b(urgent|immediately|right now|within \d+ (?:seconds?|minutes?)|\d+ seconds?|last chance|foran|jaldi|abhi)\b|فوری|فوراً|جلدی/iu},
  {id:'threat',label:'Threat or loss',re:/\b(blocked|suspended|arrest|penalty|account.{0,20}(?:closed|locked)|band ho|band kar|nuqsan)\b|بند|معطل|جرمانہ/iu},
  {id:'authority',label:'Claimed authority',re:/\b(bank|security team|it (?:helpdesk|department|support)|registrar|official|police|ceo|manager)\b|بینک|پولیس|رجسٹرار/iu},
  {id:'secret',label:'Sensitive information request',re:/\b(otp|password|pin|verification code|one[- ]time (?:password|code)|passcode)\b|پاس ورڈ|کوڈ/iu},
  {id:'payment',label:'Payment request',re:/\b(pay now|transfer (?:money|funds)|send (?:money|funds)|gift cards?|wire transfer)\b|رقم بھیج|فیس ادا/iu}
];
export function normalize(text) {
  return text.normalize('NFKC').replace(/[\u200B-\u200D\u2060\uFEFF]/g,'');
}
function host(value) {
  const v = value.trim().toLowerCase().replace(/\.$/,'');
  if (!v) return '';
  try {
    const u = new URL('https://' + v);
    if (u.username || u.password || u.port || u.pathname !== '/' || u.search || u.hash || !u.hostname.includes('.') || /\s/.test(v)) return null;
    return u.hostname.replace(/\.$/,'');
  } catch { return null; }
}
function within(actual, expected) {return actual===expected || actual.endsWith('.'+expected);}
export function analyze({message='',sender='',expectedDomain=''}={}) {
  if ([message,sender,expectedDomain].some(x=>typeof x!=='string')) throw new TypeError('Use plain text fields.');
  if (!message.trim()) throw new Error('Enter a message to review.');
  if (message.length>MAX_MESSAGE || sender.length>254 || expectedDomain.length>253) throw new Error('Input exceeds the supported length.');
  const expected=host(expectedDomain);
  if(expected===null) throw new Error('Enter a domain such as example.org, without a URL, port or path.');
  const text=normalize(message);
  const cues=RULES.filter(r=>r.re.test(text)).map(r=>({id:r.id,label:r.label,excerpt:text.match(r.re)[0]}));
  const technical=[];
  const urls=[];
  for (const m of text.matchAll(/https?:\/\/[^\s<>"']+/giu)) {
    if(urls.length>=30) break;
    const raw=m[0].replace(/[),.;!?]+$/u,'');
    try {
      const u=new URL(raw);urls.push({text:raw,host:u.hostname});
      if(expected&&!within(u.hostname.toLowerCase().replace(/\.$/,''),expected)) technical.push({id:'domain_mismatch',detail:'Link host differs from the expected domain: '+u.hostname});
      if(u.username||u.password) technical.push({id:'userinfo',detail:'Link contains text before @ that can disguise its destination.'});
      if(u.protocol==='http:') technical.push({id:'http',detail:'Link uses unencrypted HTTP.'});
      if(/(^|\.)xn--/i.test(u.hostname)) technical.push({id:'idn',detail:'Internationalized domain needs manual review: '+u.hostname});
      if(/^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname)||u.hostname.startsWith('[')) technical.push({id:'ip',detail:'Link uses an IP address instead of a domain.'});
    } catch {technical.push({id:'unparsed_url',detail:'A URL-like string could not be parsed. Verify it independently.'});}
  }
  if(sender.trim()) {
    const match=sender.trim().match(/^[^\s@<>]+@([^\s@<>]+)$/u);
    if(!match) technical.push({id:'sender_format',detail:'Sender field is not a simple email address. No sender authentication is available.'});
    else if(expected) {
      const s=host(match[1]);
      if(!s||!within(s,expected)) technical.push({id:'sender_mismatch',detail:'Stated sender domain differs from the expected domain.'});
    }
  }
  const unique=[...new Map(technical.map(x=>[x.id+'|'+x.detail,x])).values()];
  // Categories are a disclosed rule policy, never probabilities of phishing.
  const high=unique.length>0 || cues.some(c=>['secret','payment'].includes(c.id)) || (cues.some(c=>c.id==='urgency')&&cues.some(c=>c.id==='threat'));
  const category=high?'Verify before acting':cues.length?'Review the context':'No listed cues found';
  return {version:VERSION,category,cues,technical:unique,urls,mode:'Deterministic rules',
    explanation:high?'Use an independent, known channel before responding.':cues.length?'These phrases can also appear in legitimate messages. Check who sent the request and why.':'The rules did not match. This does not establish that a message or link is safe.',
    nextSteps:['Open the official app or use a contact you already know.','Do not provide passwords or one-time codes in response to a message.','Follow your institution’s reporting and urgent-response procedures.'],
    limits:'Message cues do not prove intent or authenticity. No URL is visited, no sender is authenticated, and no trained AI model runs.'};
}
