import FinancialRecord from "../models/FinancialRecord.js";

const createRecord = async (data, userId) => {
  await FinancialRecord.create({
    ...data,
    createdBy: userId,
  });
};

const getAllRecords = async (query) => {
  const {
    type,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sortBy = "date",
    order = "desc",
  } = query;

  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "desc" ? -1 : 1;

  const [records, total] = await Promise.all([
    FinancialRecord.find(filter)
      .populate("createdBy", "name email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    FinancialRecord.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  };
};

const getRecordById = async (id) => {
  const record = await FinancialRecord.findById(id).populate(
    "createdBy",
    "name email",
  );
  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }
  return record;
};

const updateRecord = async (id, data) => {
  const record = await FinancialRecord.findById(id);

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(record, data);
  await record.save();
};

const deleteRecord = async (id) => {
  // Soft delete
  const record = await FinancialRecord.findById(id);

  if (!record) {
    const error = new Error("Record not found");
    error.statusCode = 404;
    throw error;
  }
  record.isDeleted = true;
  await record.save();
};

export default {
  CreateRecord: createRecord,
  GetAllRecords: getAllRecords,
  GetRecordById: getRecordById,
  UpdateRecord: updateRecord,
  DeleteRecord: deleteRecord,
};
