import React from "react";
import { TextField, MenuItem } from "@material-ui/core";

import { getText } from "../translation";

const Select = ({
  value,
  onValueChange,
  label,
  options,
  reliesOn,
  lang,
  className,
}) => {
  const off = reliesOn === "" || reliesOn === "All";

  const choices = [
    <MenuItem key={-1} value="All">
      {getText("All", lang)}
    </MenuItem>,
  ];
  if (Array.isArray(options)) {
    choices.push(
      ...options.map((title, i) => (
        <MenuItem key={i} value={title}>
          {getText(title, lang)}
        </MenuItem>
      ))
    );
  }

  return (
    <TextField
      select
      value={value}
      label={getText(label, lang)}
      onChange={onValueChange}
      className={className}
      disabled={off}
    >
      {choices}
    </TextField>
  );
};

export default Select;
