import React, { Component, Fragment } from "react";
import _ from "lodash";
import {
  getPatients,
  getConditions,
  paginatePatients
} from "../services/patientServices";
import SearchBox from "../common/search";
import Table from "../common/table";
import Footer from "../common/footer";
import Pagination from "../common/pagination";
import { paginate } from "../utils/paginate";

import { toast } from "react-toastify";

class Patient extends Component {
  state = {
    patientInfo: [],
    patientSortColumn: { path: "name", order: "asc" },
    conditionInfo: [],
    conditionsSortColumn: { path: "cname", order: "asc" },
    searchBy: "",
    searchString: "",
    patientPagination: {
      next: "",
      previous: ""
    },
    conditionPagination: {
      count: 0,
      currentPage: 1
    },
    pageSize: 5,
    errorOccured: false
  };
  //reset the state variables
  resetState = () => {
    this.setState({
      patientInfo: [],
      conditionInfo: [],
      searchBy: "",
      searchString: "",
      patientPagination: {
        next: "",
        previous: ""
      },
      conditionPagination: {
        count: 0,
        currentPage: 1
      },
      errorOccured: false
    });
  };

  handlePatientSort = patientSortColumn => {
    this.setState({ patientSortColumn });
  };

  handleConditionSort = conditionsSortColumn => {
    this.setState({ conditionsSortColumn });
  };

  handleSearchChange = value => {
    this.setState({
      searchString: value,
      patientInfo: [],
      conditionInfo: [],
      patientSortColumn: { path: "name", order: "asc" },
      conditionsSortColumn: { path: "cname", order: "asc" },
      conditionPagination: {
        count: 0,
        currentPage: 1
      },
      patientPagination: {
        next: "",
        previous: ""
      },
      errorOccured: false
    });
  };

  handleSearchClick = async e => {
    e.preventDefault();
    const { searchBy, searchString, pageSize } = this.state;

    try {
      const { patients, next, previous } = await getPatients(
        searchBy,
        searchString,
        pageSize
      );
      const patientInfo = this.getPatientData(patients);
      this.setState({
        patientInfo,
        patientPagination: { next, previous }
      });
    } catch (error) {
      this.setState({ errorOccured: true });
    }
  };

  handleRadioChange = e => {
    this.setState({
      searchBy: e.target.value,
      conditionInfo: [],
      patientInfo: [],
      searchString: "",
      errorOccured: false,
      patientPagination: {
        next: "",
        previous: ""
      },
      conditionPagination: {
        count: 0,
        currentPage: 1
      }
    });
  };

  getPatientData = patients => {
    return patients.map(p => {
      return {
        name: p.name.find(name => name.use === "official").text,
        _id: p.id,
        gender: p.gender,
        dob: p.birthDate,
        patientPagination: { next: p.next, previous: p.previous }
      };
    });
  };

  getConditionData = conditions => {
    const data = conditions
      .filter(c => c.clinicalStatus === "active")
      .map(c => {
        return {
          cname: c.code.text,
          date: c.dateRecorded ? c.dateRecorded : ""
        };
      });

    return data ? data : null;
  };

  handleRowClick = async patient => {
    try {
      const response = await getConditions(patient._id);
      const { conditions: patientConditions } = response;

      const data = this.getConditionData(patientConditions);
      const conditionInfo = data ? data : [];

      this.setState({
        conditionInfo,
        conditionPagination: {
          count: conditionInfo.length,
          currentPage: 1
        }
      });
    } catch (error) {
      this.setState({ errorOccured: true });
      toast.error("Unexpected error..");
    }
  };

  updatePatientInfo = ({ patients, next, previous }) => {
    const patientInfo = this.getPatientData(patients);
    this.setState({
      patientInfo,
      patientPagination: {
        next,
        previous
      },
      errorOccured: false
    });
  };

  handlePagination = async e => {
    const { id: move } = e.target;
    const { patientPagination } = this.state;
    try {
      this.updatePatientInfo(await paginatePatients(patientPagination[move]));
    } catch (error) {
      this.setState({ errorOccured: true });
      toast.error("Unexpected error..");
    }
  };

  handlePage = page => {
    this.setState({
      ...this.state,
      conditionPagination: {
        currentPage: page,
        count: this.state.conditionInfo.length
      }
    });
  };

  render() {
    const {
      patientInfo,
      conditionInfo,
      errorOccured,
      patientSortColumn,
      conditionsSortColumn,
      patientPagination,
      conditionPagination,
      pageSize
    } = this.state;

    const { previous: p_previous, next: p_next } = patientPagination;
    const { count, currentPage } = conditionPagination;

    const patientColumns = [
      { path: "name", label: "Name" },
      { path: "_id", label: "Patient ID" },
      { path: "gender", label: "Gender" },
      { path: "dob", label: "Birth Date" }
    ];

    const conditionColumns = [
      {
        path: "cname",
        label: "Condition Name",
        content: condition => {
          const name = condition.cname;
          return (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://www.ncbi.nlm.nih.gov/pubmed/?term=${name}`}
            >
              {name}
            </a>
          );
        }
      },
      { path: "date", label: "First Record Date" }
    ];

    const patientsData = _.orderBy(
      patientInfo,
      [patientSortColumn.path],
      [patientSortColumn.order]
    );

    let conditionData = _.orderBy(
      conditionInfo,
      [conditionsSortColumn.path],
      [conditionsSortColumn.order]
    );

    //filter the conditions based on the current page and page size
    conditionData = paginate(conditionData, currentPage, pageSize);

    return (
      <Fragment>
        <div className="banner">
          <div>
            <form>
              <h2 className={"formGroup"}>Patient Details </h2>

              <div className={"formGroup radio"}>
                <label htmlFor="#name"> Patient Name </label>
                <input
                  type="radio"
                  id="name"
                  name="search"
                  value="name"
                  onChange={this.handleRadioChange}
                />
              </div>
              <div className={"formGroup radio"}>
                <label htmlFor="#id"> Patient ID </label>
                <input
                  type="radio"
                  id="id"
                  name="search"
                  value="_id"
                  onChange={this.handleRadioChange}
                />
              </div>
              <div className={"formGroup"}>
                <SearchBox
                  value={this.state.searchString}
                  onChange={this.handleSearchChange}
                  disabled={!this.setState.searchBy}
                />
              </div>
              <button
                className="btn btn-secondary"
                onClick={e => this.handleSearchClick(e)}
              >
                {" "}
                Search{" "}
              </button>
            </form>
          </div>
        </div>
        {errorOccured && (
          <p className="usrmsg"> Please correct the input and retry. </p>
        )}
        {patientInfo && patientInfo.length > 0 && (
          <Table
            id="patientGeo"
            columns={patientColumns}
            data={patientsData}
            sortColumn={this.state.patientSortColumn}
            onSort={this.handlePatientSort}
            handleClick={this.handleRowClick}
          />
        )}
        {(p_previous || p_next) && (
          <Footer
            paginate={this.state.patientPagination}
            handlePagination={this.handlePagination}
          />
        )}
        {conditionInfo && conditionInfo.length > 0 && (
          <Table
            id="patientsCondition"
            className="condition-tbl"
            columns={conditionColumns}
            data={conditionData}
            sortColumn={this.state.conditionsSortColumn}
            onSort={this.handleConditionSort}
          />
        )}

        {/*** Pagination logic to display the conditions list***/}
        <Pagination
          id="conditionsPagination"
          itemsCount={count}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePage}
        />
      </Fragment>
    );
  }
}

export default Patient;
