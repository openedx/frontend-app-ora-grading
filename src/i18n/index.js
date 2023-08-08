import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as paragonMessages } from '@edx/paragon';

import arMessages from './messages/ar.json';
// no need to import en messages-- they are in the defaultMessage field
import es419Messages from './messages/es_419.json';
import faIRMessages from './messages/fa_IR.json';
import frMessages from './messages/fr.json';
import zhcnMessages from './messages/zh_CN.json';
import dedeMessages from './messages/de_DE.json';
import frcaMessages from './messages/fr_CA.json';
import hiMessages from './messages/hi.json';
import ititMessages from './messages/it_IT.json';
import ptptMessages from './messages/pt_PT.json';
import ruMessages from './messages/ru.json';
import ukMessages from './messages/uk.json';

const appMessages = {
  ar: arMessages,
  'fa-ir': faIRMessages,
  'es-419': es419Messages,
  fr: frMessages,
  'zh-cn': zhcnMessages,
  'de-de': dedeMessages,
  'fr-ca': frcaMessages,
  hi: hiMessages,
  'it-it': ititMessages,
  'pt-pt': ptptMessages,
  ru: ruMessages,
  uk: ukMessages,
};

export default [
  headerMessages,
  footerMessages,
  paragonMessages,
  appMessages,
];
