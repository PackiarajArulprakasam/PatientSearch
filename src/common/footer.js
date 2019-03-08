import React, { Fragment } from "react";
import PropTypes from "prop-types";

const Footer = ({ paginate, handlePagination }) => {
  const { previous, next } = paginate;

  return (
    <Fragment>
      {(previous || next) && (
        <button
          className="btn btn-primary page-btn page-prev"
          id="previous"
          onClick={e => handlePagination(e)}
          disabled={!previous}
        >
          Previous
        </button>
      )}

      {(previous || next) && (
        <button
          className="btn btn-primary page-btn page-next"
          id="next"
          type="button"
          onClick={e => handlePagination(e)}
          disabled={!next}
        >
          Next
        </button>
      )}
    </Fragment>
  );
};

Footer.propTypes = {
  handlePagination: PropTypes.func.isRequired,
  paginate: PropTypes.object.isRequired
};

export default Footer;
