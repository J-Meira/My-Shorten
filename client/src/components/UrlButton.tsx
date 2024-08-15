import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { MdContentCopy } from 'react-icons/md';
import { IUrl } from '../@types';

interface Props {
  content: IUrl;
  large?: boolean;
}

export const UrlButton = ({ content, large }: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('Copy to Clipboard');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getLink());
      setTooltipText('Copied!');
      setTooltipOpen(true);
      setTimeout(() => {
        setTooltipOpen(false);
      }, 1500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleMouseEnter = () => {
    setTooltipText('Copy to Clipboard');
    setTooltipOpen(true);
  };

  const handleMouseLeave = () => {
    setTooltipOpen(false);
  };

  const getLink = () => `${import.meta.env.VITE_URL}/${content.code}`;

  return (
    <Tooltip title={tooltipText} open={tooltipOpen} disableHoverListener>
      <Button
        color='inherit'
        startIcon={<MdContentCopy />}
        onClick={handleCopy}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          textTransform: 'none',
          fontSize: large ? '2rem' : undefined,
        }}
      >
        {getLink()}
      </Button>
    </Tooltip>
  );
};
