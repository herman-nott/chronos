import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    calendar_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calendar",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: String,

    // категория
    category: {
      type: String,
      required: true,
      enum: ["arrangement", "reminder", "task"],
    },

    // -------- ARRANGEMENT --------
    start_time: {
      type: Date,
      required: function () {
        return this.category === "arrangement";
      },
    },
    end_time: {
      type: Date,
      required: function () {
        return this.category === "arrangement";
      },
    },
    location: {
      type: String,
      required: false,
    },
    participants: [
      {
        type: String,
        validate: {
          validator: (v) => /^\S+@\S+\.\S+$/.test(v),
          message: (props) => `${props.value} is not a valid email`,
        },
      },
    ],

    // -------- REMINDER --------
    reminder_time: {
      type: Date,
      required: function () {
        return this.category === "reminder";
      },
    },

    // -------- TASK --------
    due_date: {
      type: Date,
      required: function () {
        return this.category === "task";
      },
    },
    is_completed: {
      type: Boolean,
      default: false,
    },

    // общие для всех
    reminders: [Number],

    // для того, шоб поделиться ивентом
    shared_with: [{
      email: { 
        type: String, 
        // required: true // мешает публичности ссылко
      },
      userid: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      permission: { 
        type: String, 
        enum: ['view', 'edit'], 
        default: 'view' 
      },
      accepted: { 
        type: Boolean, 
        default: false 
      },
      shareToken: { 
        type: String, 
        unique: true,
        sparse: true  // Allows multiple null values
      },
      sharedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      sharedAt: { 
        type: Date, 
        default: Date.now 
      }
    }],
    color: { 
        type: String
    },
    is_system_holiday: { 
        type: Boolean
    },
    is_readonly: { 
        type: Boolean
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
export default Event;
