// const mongoose = require("mongoose");

// // Define the Section schema
// const sectionSchema = new mongoose.Schema({
// 	sectionName: {
// 		type: String,
// 	},
// 	subSection: [
// 		{
// 			type: mongoose.Schema.Types.ObjectId,
// 			required: true,
// 			ref: "SubSection",
// 		},
// 	],
// });

// // Export the Section model
// module.exports = mongoose.model("Section", sectionSchema);

const mongoose = require("mongoose")

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    required: true,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
})

module.exports = mongoose.model("Section", sectionSchema)
