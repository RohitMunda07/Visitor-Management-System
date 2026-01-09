import mongoose from "mongoose";

const gatePassSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
      unique: true, // one gate pass per visitor
    },

    gatePassNumber: {
      type: String,
      required: true,
      unique: true,
    },

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // security user
      required: true,
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "USED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const GatePass = mongoose.model("GatePass", gatePassSchema);
