import React from "react";
import PropTypes from "prop-types";
//Reusable search bar component

const SearchBox = ({ value, onChange }) => {
  return (
    <input
      type="text"
      name="query"
      className="form-search my-3 border-secondary"
      style={{ width: 300, borderWidth: 2 }}
      placeholder={"Search..."}
      value={value}
      onChange={event => onChange(event.currentTarget.value)}
    />
  );
};

SearchBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SearchBox;
