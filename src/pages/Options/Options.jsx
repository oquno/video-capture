import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextareaAutosize } from '@material-ui/core';
import { MySnackbar } from '../../components/MySnackbar';

import { JA, EN } from '../../components/locale';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
};

const Options = () => {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(null);
  const [iframe, setIframe] = useState(null);
  const debouncedList = useDebounce(list, 500);
  const debouncedIframe = useDebounce(iframe, 500);

  useEffect(() => {
    chrome.storage.sync.get(['blacklist', 'iframe'], (result) => {
      if (result.blacklist) setList(result.blacklist);
      if (result.iframe) setIframe(result.iframe);
    });
  }, []);

  const onChange = (value) => {
    setList(value);
  };

  useEffect(() => {
    if (list !== null) {
      chrome.storage.sync.get(['blacklist'], (result) => {
        if (result.blacklist !== list) {
          chrome.storage.sync.set({ blacklist: debouncedList });
          setOpen(true);
        }
      });
    }
  }, [debouncedList]);

  useEffect(() => {
    if (iframe !== null) {
      chrome.storage.sync.get(['iframe'], (result) => {
        if (result.iframe !== iframe) {
          chrome.storage.sync.set({ iframe: debouncedIframe });
          setOpen(true);
        }
      });
    }
  }, [debouncedIframe]);

  return (
    <Paper style={{ padding: '20px', margin: '20px', maxWidth: '800px' }}>
      <Typography variant="h2">Capture Video Element</Typography>
      <Typography variant="h4">
        <JA>メタデータを送信しないサイトのリスト</JA>
        <EN>Domain list for sending site metadata</EN>
      </Typography>
      <TextareaAutosize
        defaultValue={list}
        onChange={(e) => onChange(e.target.value)}
        rowsMin={15}
        style={{ width: '95%' }}
      />
      <Typography variant="h4">
        <JA>iframeのキャプチャを許可するドメインのリスト</JA>
        <EN>Domain list for allow iframe capture</EN>
      </Typography>
      <TextareaAutosize
        defaultValue={iframe}
        onChange={(e) => setIframe(e.target.value)}
        rowsMin={15}
        style={{ width: '95%' }}
      />
      <MySnackbar open={open} setOpen={setOpen} message={'Saved'} />
    </Paper>
  );
};

export default Options;
