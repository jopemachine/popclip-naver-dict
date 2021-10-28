import __ from "https://deno.land/x/dirname/mod.ts";
import { JSZip } from "https://deno.land/x/jszip/mod.ts";

import {
  emptyDirSync,
  ensureDirSync,
} from "https://deno.land/std@0.113.0/fs/mod.ts";

// https://{lang}.dict.naver.com/#/search?query={popclip text}
const langsWithNewAPI = {
  'en': '영어',
  'ko': '국어',
  'ja': '일본어',
  'hanja': '한자',
  'zh': '중국어',
};

// https://dict.naver.com/{lang}/#/search?query={popclip text}
const langsWithOldAPI = {
  'frkodict': '프랑스어',
  'eskodict': '스페인어',
  'dekodict': '독일어',
  'vikodict': '베트남어',
  'nekodict': '네팔어',
  'mnkodict': '몽골어',
  'mykodict': '미얀마어',
  'swkodict': '스와힐리어',
  'arkodict': '아랍어',
  'uzkodict': '우즈베크어',
  'idkodict': '인도네시아어',
  'kmkodict': '캄보디아어',
  'thkodict': '태국어',
  'tetkodict': '테툼어',
  'fakodict': '페르시아어',
  'hakodict': '하우사어',
  'hbkokodict': '고대 히브리어',
  'hikodict': '힌디어',
  'elkodict': '현대 그리스어',
  'grckodict': '고대 그리스어',
  'nlkodict': '네덜란드어',
  'lakodict': '라틴어',
  'rukodict': '러시아어',
  'rokodict': '루마니아어',
  'svkodict': '스웨덴어',
  'sqkodict': '알바니아어',
  'ukkodict': '우크라이나어',
  'itkodict': '이탈리아어',
  'kakodict': '조지아어',
  'cskodict': '체코어',
  'hrkodict': '크로아티아어',
  'trkodict': '터키어',
  'ptkodict': '포르투갈어',
  'plkodict': '폴란드어',
  'fikodict': '핀란드어',
  'hukodict': '헝가리어'
}

ensureDirSync('packages');
emptyDirSync('packages');

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");
const templateData = Deno.readFileSync('template.plist');
const templateStr = decoder.decode(templateData);

for (const lang of [...Object.keys(langsWithNewAPI), ...Object.keys(langsWithOldAPI)]) {
  let configPlistStr = templateStr;

  let fileName;
  // In case of old api
  if (lang.endsWith('dict')) {
    fileName = (langsWithOldAPI as any)[lang];
    configPlistStr = configPlistStr.replaceAll('{url}', `https://dict.naver.com/${lang}/#/search?query={popclip text}`);
  } else {
    fileName = (langsWithNewAPI as any)[lang];
    configPlistStr = configPlistStr.replaceAll('{url}', `https://${lang}.dict.naver.com/#/search?query={popclip text}`);
  }

  configPlistStr = configPlistStr.replaceAll('{language}', lang);
  configPlistStr = configPlistStr.replaceAll('{language code}', lang.substr(0, 3));
  configPlistStr = configPlistStr.replaceAll('{language korean}', fileName);

  const zip = new JSZip();
  const pkgFolder = zip.folder(`${lang}.popclipext`);
  pkgFolder.addFile('Config.plist', encoder.encode(configPlistStr));

  await zip.writeZip(`packages/${fileName}.popclipextz`);
}
