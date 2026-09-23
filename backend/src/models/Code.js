import mongoose from "mongoose";

const codeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Code",
    },

    language: {
      type: String,
      required: true,
      default: "javascript",
    },

    code: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);


const Code = mongoose.model("Code", codeSchema);

export default Code;