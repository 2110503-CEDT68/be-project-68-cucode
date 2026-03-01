const mongoose = require("mongoose");

const CoworkingSpaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    tel: {
      type: String,
      required: [true, "Please add a telephone number"],
    },
    open_close_time: {
      type: String,
      required: [true, "Please add open-close time"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Cascade delete bookings when a coworking space is deleted
CoworkingSpaceSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    console.log(`Bookings being removed from coworking space ${this._id}`);
    await this.model("Booking").deleteMany({ coworkingspace: this._id });
  }
);

// Reverse populate with virtuals
CoworkingSpaceSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "coworkingspace",
  justOne: false,
});

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
