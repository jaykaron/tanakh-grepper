import { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { Share } from '@material-ui/icons';
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyUrlButton = () => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const openAndClose = () => {
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 2500);
  };

  return (
  <Tooltip 
    open={tooltipOpen}
    disableFocusListener
    disableHoverListener
    disableTouchListener
    title="URL Copied!"
    onClose={() => setTooltipOpen(false)}
  >
    <CopyToClipboard text={window.location.href} onCopy={openAndClose}>
      <IconButton title="Share Link">
        <Share />
      </IconButton>
    </CopyToClipboard>
  </Tooltip>
);
  }
export default CopyUrlButton;