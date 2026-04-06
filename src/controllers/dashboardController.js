import DashboardServices from "../services/dashboardService.js";
import { successResponse } from "../utils/apiResponse.js";

export const getSummary = async (req, res, next) => {
  try {
    const data = await DashboardServices.GetSummary();
    return successResponse(res, 200, "Summary fetched successfully", data);
  } catch (error) {
    next(error);
  }
};

export const getCategorySummary = async (req, res, next) => {
  try {
    const data = await DashboardServices.GetCategorySummary();
    return successResponse(
      res,
      200,
      "Category summary fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const data = await DashboardServices.GetRecentActivity(req.query.limit);
    return successResponse(
      res,
      200,
      "Recent activity fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await DashboardServices.GetMonthlyTrends(req.query.year);
    return successResponse(
      res,
      200,
      "Monthly trends fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};

export const getWeeklyTrends = async (req, res, next) => {
  try {
    const data = await DashboardServices.GetWeeklyTrends(req.query.startDate);
    return successResponse(
      res,
      200,
      "Weekly trends fetched successfully",
      data,
    );
  } catch (error) {
    next(error);
  }
};
