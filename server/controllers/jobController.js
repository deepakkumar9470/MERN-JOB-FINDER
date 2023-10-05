import mongoose from "mongoose"
import Job from "../models/Job.js"
import Company from "../models/Company.js"


export const createJob = async (req,res,next) =>{
  try {
    const {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;

    if (
      !jobTitle ||
      !jobType ||
      !location ||
      !salary ||
      !requirements ||
      !desc
    ) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const jobPost = {
      jobTitle,
      jobType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      company: id,
    };

    const job = new Job(jobPost);
    await job.save();

    //update the company information with job id
    const company = await Company.findById(id);

    company.jobPosts?.push(job._id);
    const updateCompany = await Company.findByIdAndUpdate(id, company, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Job Posted Successfully",
      job,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
}

export const updateJob = async (req,res,next) =>{
    const {jobId} = req.params
    const {jobTitle,jobType,location,salary,vacancies,desc,experience,requirements} = req.body
    if (!jobTitle || !jobType || !location || !salary || !requirements || !desc) {
        next("Please Provide All Required Fields");
        return;
      }

      try {
        
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).send(`No Company with id: ${id}`);
    }

    const jobpost = {
        jobTitle,
        jobType,
        location,
        salary,
        vacancies,
        experience,
        detail  :{desc,requirements},
        _id : jobId
    }

   await Job.findByIdAndUpdate(jobId,jobpost, {new:true})

     res.status(201).json({
        success : true,
        message : "Job post updated Successfully",
        jobpost,
     })
 
      } catch (error) {
        res.status(404).json({
            message  : error.message
        })
      }
}

export const deleteJobPost = async (req,res,next) =>{


   try {

    await Job.findByIdAndDelete(req.params.id)
    
    res.status(200).json({
        success: true,
        message : "Job post deleted successfully"
    });
    } catch (error) {
        res.status(404).json({message :error.message})
    }
}

export const getJobById = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const job = await Job.findById({ _id: id }).populate({
        path: "company",
        select: "-password",
      });
  
      if (!job) {
        return res.status(200).send({
          message: "Job Post Not Found",
          success: false,
        });
      }
  
      //GET SIMILAR JOB POST
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: job?.jobTitle, $options: "i" } },
          { jobType: { $regex: job?.jobType, $options: "i" } },
        ],
      };
  
      let queryResult = Job.find(searchQuery)
        .populate({
          path: "company",
          select: "-password",
        })
        .sort({ _id: -1 });
  
      queryResult = queryResult.limit(6);
      const similarJobs = await queryResult;
  
      res.status(200).json({
        success: true,
        data: job,
        similarJobs,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
};

export const getJobPosts = async (req, res, next) => {
    try {
      const { search, sort, location, jtype, exp } = req.query;
      const types = jtype?.split(","); //full-time,part-time
      const experience = exp?.split("-"); //2-6
  
      let queryObject = {};
  
      if (location) {
        queryObject.location = { $regex: location, $options: "i" };
      }
  
      if (jtype) {
        queryObject.jobType = { $in: types };
      }
  
      //    [2. 6]
  
      if (exp) {
        queryObject.experience = {
          $gte: Number(experience[0]) - 1,
          $lte: Number(experience[1]) + 1,
        };
      }
  
      if (search) {
        const searchQuery = {
          $or: [
            { jobTitle: { $regex: search, $options: "i" } },
            { jobType: { $regex: search, $options: "i" } },
          ],
        };
        queryObject = { ...queryObject, ...searchQuery };
      }
  
      let queryResult = Job.find(queryObject).populate({
        path: "company",
        select: "-password",
      });
  
      // SORTING
      if (sort === "Newest") {
        queryResult = queryResult.sort("-createdAt");
      }
      if (sort === "Oldest") {
        queryResult = queryResult.sort("createdAt");
      }
      if (sort === "A-Z") {
        queryResult = queryResult.sort("jobTitle");
      }
      if (sort === "Z-A") {
        queryResult = queryResult.sort("-jobTitle");
      }
  
      // pagination
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const skip = (page - 1) * limit;
  
      //records count
      const totalJobs = await Job.countDocuments(queryResult);
      const numOfPage = Math.ceil(totalJobs / limit);
  
      queryResult = queryResult.limit(limit * page);
  
      const jobs = await queryResult;
  
      res.status(200).json({
        success: true,
        totalJobs,
        data: jobs,
        page,
        numOfPage,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
};