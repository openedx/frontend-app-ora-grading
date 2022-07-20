import { useEffect, useState } from 'react';
import { get } from 'axios';

import { StrictDict } from 'utils';
import * as module from './textHooks';

export const state = StrictDict({
  content: (val) => useState(val),
});

export const fetchFile = async ({
  setContent,
  url,
  onError,
  onSuccess,
}) => get(url)
  .then(({ data }) => {
    onSuccess();
    setContent(data);
  })
  .catch((e) => onError(e.response.status));

export const rendererHooks = ({ url, onError, onSuccess }) => {
  const [content, setContent] = module.state.content('');
  useEffect(() => {
    module.fetchFile({
      setContent,
      url,
      onError,
      onSuccess,
    });
  }, [onError, onSuccess, setContent, url]);
  return { content };
};
