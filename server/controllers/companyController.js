import mongoose from 'mongoose';
import Company from '../models/Company.js'


export const register = async (req, res, next) => {
    const { name, email, password } = req.body;
  
    //validate fileds
  
    if (!name) {
      next("First Name is required");
    }
    if (!email) {
      next("Email is required");
    }
    if (!password) {
      next("Password is required");
    }
  
    try {
      const accountExist = await Company.findOne({ email });
  
      if (accountExist) {
        next("Email Address already exists.Please login");
        return;
      }
  
      const company = await Company.create({
        name,
        email,
        password,
      });
  
      // company token
      const token = company.createJWT();
  
      res.status(201).send({
        success: true,
        message: "Company account created successfully",
        user: {
          _id: company._id,
          name: company.name,
          email: company.email,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
};
  
export const login = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      //validation
      if (!email || !password) {
        next("Please Provide AUser Credentials");
        return;
      }
  
      // find user by email
      const company = await Company.findOne({ email }).select("+password");
  
      if (!company) {
        next("Invalid email or password");
        return;
      }
  
      // compare password
      const isMatch = await company.comparePassword(password);
  
      if (!isMatch) {
        next("Invalid email or password");
        return;
      }
  
      company.password = undefined;
  
      const token = company.createJWT();
  
      res.status(201).json({
        success: true,
        message: "Login successfully",
        user:company,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error.message });
    }
};

export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    // validation
    if (!name || !location || !about || !contact || !profileUrl) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No Company with id: ${id}`);

    }
    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Company.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    const token = company.createJWT();

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }





}

export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Company.findById({ _id: id });

    if (!company) {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Company.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
    }

    // PAGINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Company.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyJobListing = async (req, res, next) => {
    const {search,sort} = req.query
    const id = req.body.user.userId
    try {
        const queryObject = {};
        if(search){
            queryObject = {$regex : search, $options : "i"}
        }
        let sorting;
        if(sort === "Newest"){
            sorting = "-createdAt"                    
        }
        if(sort === "Oldest"){
            sorting = "createdAt"
        }
        if(sort === "A-Z"){
            sorting = "name"
        }
        if(sort === "Z-A"){
            sorting = "-name"
        }

        const queryResult = await Company.findById({_id:id}).populate({
            path: "jobPosts",
            options : {sort : sorting}
        })

        const companies = await queryResult;
        res.status(200).json({
            success : true,
            companies
          })

    } catch (error) {
        res.status(202).json({message :error.message})
    }
}

export const getCompanyById = async (req, res, next) => {
  
    try {
       
        const company = await Company.findById(req.params.id).populate({
            path: "jobPosts",
            options : 
             {
                sort : "-_id",
             }
        })
        if(!company){
            res.status(200).json({
                success : false,
                message : "Company not found"
              })
        }
        company.password = undefined;
        res.status(200).json({
            success : true,
            data : company
          })

    } catch (error) {
        res.status(202).json({message :error.message})
    }
}