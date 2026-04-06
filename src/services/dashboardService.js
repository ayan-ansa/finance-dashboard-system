import FinancialRecord from "../models/FinancialRecord.js";

const getSummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const summary = { totalIncome: 0, totalExpenses: 0, netBalance: 0 };

  result.forEach((item) => {
    if (item._id === "income") summary.totalIncome = item.total;
    if (item._id === "expense") summary.totalExpenses = item.total;
  });

  summary.netBalance = summary.totalIncome - summary.totalExpenses;
  return summary;
};

const getCategorySummary = async () => {
  const result = await FinancialRecord.aggregate([
    { $match: { isDeleted: false } },
    {
      $group: {
        _id: { category: "$category", type: "$type" },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        total: 1,
        count: 1,
      },
    },
    { $sort: { total: -1 } },
  ]);

  return result;
};

const getRecentActivity = async (limit = 10) => {
  const records = await FinancialRecord.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  return records;
};

const getMonthlyTrends = async (year) => {
  const targetYear = year || new Date().getFullYear();

  const result = await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: {
          $gte: new Date(`${targetYear}-01-01`),
          $lte: new Date(`${targetYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  // Format into clean monthly structure
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const trends = months.map((month, index) => {
    const monthData = { month, income: 0, expenses: 0 };
    result.forEach((item) => {
      if (item._id.month === index + 1) {
        if (item._id.type === "income") monthData.income = item.total;
        if (item._id.type === "expense") monthData.expenses = item.total;
      }
    });
    return monthData;
  });

  return { year: targetYear, trends };
};

const getWeeklyTrends = async (startDate) => {
  const start = startDate ? new Date(startDate) : new Date();
  start.setDate(start.getDate() - 28); // Last 4 weeks by default

  const result = await FinancialRecord.aggregate([
    {
      $match: {
        isDeleted: false,
        date: { $gte: start },
      },
    },
    {
      $group: {
        _id: {
          week: { $week: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.week": 1 } },
  ]);

  return result;
};

export default {
  GetSummary: getSummary,
  GetCategorySummary: getCategorySummary,
  GetRecentActivity: getRecentActivity,
  GetMonthlyTrends: getMonthlyTrends,
  GetWeeklyTrends: getWeeklyTrends,
};
