import Code from "../models/Code.js";

export const createCode = async (req, res) => {
  try {
    const { title, language, code, htmlCode } = req.body;

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    if (!title || !language || !code) {
      return res.status(400).json({
        message: "Title, language and code are required",
      });
    }

    const newCode = await Code.create({
      title: title.trim(),
      language,
      code,
      htmlCode: htmlCode || "",
      user: req.userId,
    });

    console.log("Code Created:", newCode._id.toString());

    return res.status(201).json({
      message: "Code created successfully",
      data: newCode,
    });
  } catch (error) {
    console.error("Create Code Error:", error);

    return res.status(500).json({
      message: "Error creating code",
      error: error.message,
    });
  }
};

export const getCodes = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const codes = await Code.find({
      user: req.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json(codes);
  } catch (error) {
    console.error("Get Codes Error:", error);

    return res.status(500).json({
      message: "Error fetching codes",
      error: error.message,
    });
  }
};

export const getCodeById = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const code = await Code.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!code) {
      return res.status(404).json({
        message: "Code not found",
      });
    }

    return res.status(200).json(code);
  } catch (error) {
    console.error("Get Code Error:", error);

    return res.status(500).json({
      message: "Error fetching code",
      error: error.message,
    });
  }
};

export const updateCode = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const { title, language, code, htmlCode } = req.body;

    const updatedCode = await Code.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId,
      },
      {
        title,
        language,
        code,
        htmlCode: htmlCode || "",
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!updatedCode) {
      return res.status(404).json({
        message: "Code not found",
      });
    }

    return res.status(200).json({
      message: "Code updated successfully",
      data: updatedCode,
    });
  } catch (error) {
    console.error("Update Code Error:", error);

    return res.status(500).json({
      message: "Error updating code",
      error: error.message,
    });
  }
};

export const deleteCode = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const deletedCode = await Code.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deletedCode) {
      return res.status(404).json({
        message: "Code not found",
      });
    }

    return res.status(200).json({
      message: "Code deleted successfully",
    });
  } catch (error) {
    console.error("Delete Code Error:", error);

    return res.status(500).json({
      message: "Error deleting code",
      error: error.message,
    });
  }
};