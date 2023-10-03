import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import "./LanguageSelector.css";

const LanguageSelector = ({ languages, value, onChange }) => {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={onChange}
          className="language-selector-container"
        >
          {Object.keys(languages).map((code) => (
            <MenuItem key={code} value={code}>
              {languages[code]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
export default LanguageSelector;
