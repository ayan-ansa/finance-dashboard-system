import mongoose from "mongoose";

export const CATEGORIES = [
  "salary",
  "investment",
  "freelance",
  "food",
  "rent",
  "transport",
  "healthcare",
  "education",
  "entertainment",
  "utilities",
  "other",
];

const financialRecordSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    type: {
      type: String,
      required: [true, "Type is required"],
      enum: {
        values: ["income", "expense"],
        message: "Type must be income or expense",
      },
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      validate: {
        validator: function (value) {
          return value <= new Date();
        },
        message: "Date cannot be in the future",
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: "throw",
  },
);

// exclude deleted records from all find queries by default
financialRecordSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

const FinancialRecord = mongoose.model(
  "FinancialRecord",
  financialRecordSchema,
);

export default FinancialRecord;
