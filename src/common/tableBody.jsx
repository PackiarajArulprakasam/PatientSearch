import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";

/* 

// Reusable table body component

Props:
-------
1. data : Array -- contains the data 
2. columns : Array  -- has the column name

Outputs:
--------
1. Sorted table

*/

class TableBody extends Component {
  renderCell = (column, item) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };

  handleRowClick = (e, handleClick, item) => {
    e.stopPropagation();
    if (handleClick) handleClick(item);
  };

  render() {
    const { data, columns, handleClick } = this.props;
    return (
      <tbody>
        {data.map((item, idx) => (
          <tr
            className="clickable"
            key={idx}
            onClick={e => this.handleRowClick(e, handleClick, item)}
          >
            {columns.map(column => (
              <td key={column.path || column.key}>
                {this.renderCell(column, item)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

TableBody.propTypes = {
  data: PropTypes.array.isRequired,
  colums: PropTypes.array.isRequired,
  handleClick: PropTypes.func.isRequired
};

export default TableBody;
