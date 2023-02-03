import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { DarkMenu } from "../Menu";

const CollectionSearchBar = ({
  query,
  setQuery,
  option,
  options,
  setOption,
  onSearch,
}) => {
  const searchOnEnter = (e) => {
    // if ((e.charCode || e.keyCode) === 13)
    if (e.key === "Enter") onSearch();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="collection-search">
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "option-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <div className="btn btn-secondary dropw-button">
          <span className="dropw-title me-2">{option.title}</span>
          {/* <ChevronDown size={26} strokeWidth={2} color={"black"} /> */}
        </div>
      </IconButton>
      <DarkMenu anchorEl={anchorEl} open={open} handleClose={handleClose}>
        {options
          .filter((op) => op.id !== option.id)
          .map((element) => (
            <div key={element.id}>
              <MenuItem>
                <button
                  className="btn btn-outline-secondary dropw-button"
                  onClick={() => setOption(element)}
                >
                  <span>{element.title}</span>
                </button>
              </MenuItem>
              {/* <Divider /> */}
            </div>
          ))}
      </DarkMenu>
      <input
        className="form-control dark-input"
        type="search"
        maxLength="200"
        autoComplete="off"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => searchOnEnter(e)}
      />
      <div className="collection-srch" onClick={() => onSearch()}>
        <div className="input-group-text btn">
          <small>"Enter" to Search</small>
        </div>
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"24px"} />
        </button>
      </div>
    </div>
  );
};

export default CollectionSearchBar;
