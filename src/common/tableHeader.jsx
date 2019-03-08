import React, { Component } from "react";

//Reusable table header component with sort functionality

class TableHeader extends Component {
  raiseSort = path => {
    const sortColumn = { ...this.props.sortColumn };
    // check if sort order to be reversed
    const order =
      sortColumn.path === path && sortColumn.order === "asc" ? "desc" : "asc";
    console.log(path, order);
    this.props.onSort({ path, order });
  };

  renderSortIcon = path => {
    const sortColumn = { ...this.props.sortColumn };

    if (path !== sortColumn.path) return null;

    if (sortColumn.order === "asc")
      return <i className=" fa fa-arrow-circle-up" />;

    return <i className=" fa fa-arrow-circle-down" />;
  };

  render() {
    return (
      <thead style={{ backgroundColor: "grey", color: "white" }}>
        <tr>
          {this.props.columns.map(column => (
            <th
              className="clickable"
              key={column.path || column.key}
              onClick={() => this.raiseSort(column.path)}
            >
              {column.label} {this.renderSortIcon(column.path)}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
