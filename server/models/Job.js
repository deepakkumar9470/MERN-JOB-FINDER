import mongoose, { Schema } from "mongoose";

const JobSchema = new mongoose.Schema(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    jobTitle: { type: String, required: [true, "Job Title is required"] },
    jobType: { type: String, required: [true, "Job Type is required"] },
    location: { type: String, required: [true, "Location is required"] },
    salary: { type: Number, required: [true, "Salary is required"] },
    vacancies: { type: Number },
    experience: { type: Number, default: 0 },
    detail: [
        { desc: { type: String }, 
          requirements: { type: String } 
         }
           ],
    application: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

export default Job;