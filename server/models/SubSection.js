// const mongoose = require("mongoose");

// const SubSectionSchema = new mongoose.Schema({
// 	title: { type: String },
// 	timeDuration: { type: String },
// 	description: { type: String },
// 	videoUrl: { type: String },
// });

// module.exports = mongoose.model("SubSection", SubSectionSchema);

const mongoose = require("mongoose")

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  timeDuration: {
    type: String,
  },
  videoUrl: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("SubSection", subSectionSchema)
