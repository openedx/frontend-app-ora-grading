import { messages as footerMessages } from '@edx/frontend-component-footer';
import { messages as headerMessages } from '@edx/frontend-component-header';
import { messages as paragonMessages } from '@edx/paragon';

import arMessages from './messages/ar.json';
import dedeMessages from './messages/de_DE.json';
import es419Messages from './messages/es_419.json';
import faIRMessages from './messages/fa_IR.json';
import frMessages from './messages/fr.json';
import frcaMessages from './messages/fr_CA.json';
import hiMessages from './messages/hi.json';
import ititMessages from './messages/it_IT.json';
import ptptMessages from './messages/pt_PT.json';
import ruMessages from './messages/ru.json';
import ukMessages from './messages/uk.json';
import zhcnMessages from './messages/zh_CN.json';
// no need to import en messages-- they are in the defaultMessage field

const appMessages = {
  ar: arMessages,
  'de-de': dedeMessages,
  'es-419': es419Messages,
  'fa-ir': faIRMessages,
  fr: frMessages,
  'fr-ca': frcaMessages,
  hi: hiMessages,
  'it-it': ititMessages,
  'pt-pt': ptptMessages,
  ru: ruMessages,
  uk: ukMessages,
  'zh-cn': zhcnMessages,
};

export default [
  headerMessages,
  footerMessages,
  paragonMessages,
  appMessages,
];
