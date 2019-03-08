import { get } from "./httpService";
import { toast } from "react-toastify";

export const getPatients = async (queryParam, queryValue, pageSize) => {
  const url =
    "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca";
  const resource = "Patient";
  const query = {
    [queryParam]: queryValue,
    _count: pageSize
  };

  try {
    const response = await get(url, resource, query);
    const { data: patientData } = response;
    return parsePatientData(patientData);
  } catch (error) {
    toast.error("Unexpected error", new Error(error));
  }
};

export const paginatePatients = async link => {
  try {
    const response = await get(link);
    const { data: patientData } = response;
    return parsePatientData(patientData);
  } catch (error) {
    toast.error("Error in pagination", new Error(error));
  }
};

const parsePatientData = ({ link: linkList, entry }) => {
  const patients = entry && entry.map(({ resource }) => resource);
  const next = linkList.find(link => link.relation === "next");
  const previous = linkList.find(link => link.relation === "previous");

  return {
    patients,
    next: next ? next.url : null,
    previous: previous ? previous.url : null
  };
};

export const getConditions = async (queryValue, queryParam = "patient") => {
  const url =
    "https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca";
  const resource = "Condition";
  const query = {
    [queryParam]: queryValue
  };

  try {
    const response = await get(url, resource, query);
    const { data: conditionData } = response;
    return parseConditionData(conditionData);
  } catch (error) {
    toast.error("Unexpected error", new Error(error));
  }
};

const parseConditionData = ({ entry }) => {
  const conditions = entry ? entry.map(({ resource }) => resource) : [];
  return {
    conditions
  };
};
