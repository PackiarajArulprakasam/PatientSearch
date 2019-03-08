import React, { Component } from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";
import PropTypes from "prop-types";

// Reusable table component template

class Table extends Component {
  render() {
    const { columns, sortColumn, onSort, data, handleClick } = this.props;
    return (
      <table className="table table-sm table-hover table-bordered table-striped">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody data={data} columns={columns} handleClick={handleClick} />
      </table>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.array.isRequired,
  sortColumn: PropTypes.array.isRequired,
  onSort: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default Table;
