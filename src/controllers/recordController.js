import RecordServices from "../services/recordService.js";
import { successResponse } from "../utils/apiResponse.js";
import { sanitizeObject } from "../utils/sanitizeInput.js";
import { validateInputs } from "../utils/validateInputs.js";
import {
  createRecordValidator,
  getRecordsQueryValidator,
  updateRecordValidator,
} from "../validators/recordSchema.js";

export const createRecord = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(createRecordValidator, sanitizedData);
    await RecordServices.CreateRecord(parsedData, req.user._id);
    successResponse(res, 201, "Record created successfully");
  } catch (error) {
    next(error);
  }
};

export const getAllRecords = async (req, res, next) => {
  try {
    const parsedQuery = validateInputs(getRecordsQueryValidator, req.query);
    const result = await RecordServices.GetAllRecords(parsedQuery);
    successResponse(res, 200, "Records fetched successfully", result);
  } catch (error) {
    next(error);
  }
};


export const getRecordById = async (req, res, next) => {
  try {
    const record = await RecordServices.GetRecordById(req.params.id);
    return successResponse(res, 200, "Record fetched successfully", record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const sanitizedData = sanitizeObject(req.body);
    const parsedData = validateInputs(updateRecordValidator, sanitizedData);
    await RecordServices.UpdateRecord(req.params.id, parsedData);
    successResponse(res, 200, "Record updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    await RecordServices.DeleteRecord(req.params.id);
    return successResponse(res, 200, "Record deleted successfully");
  } catch (error) {
    next(error);
  }
};
