import { useEffect, useState } from "react";
// import { Linkedin } from "../assets";
import moment from "moment";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import { useParams } from "react-router-dom";
// import { jobs } from "../utils/data";
import { CustomButton, JobCard ,Loading} from "../components";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/api";

const JobDetail = () => {
  const {user} = useSelector((state)=>state.user)
  const {id} = useParams();
  // const id = parseInt(params.id) - 1;
  const [job, setJob] = useState(null);
  const [similarJobs,setSimilarJobs] = useState([])
  const [selected, setSelected] = useState("0");
  const [isLoading,setIsLoading] = useState(false)
  const fetchJobDetail = async () =>{
    setIsLoading(true)
     try {
      const res = await apiRequest({
        url : `/job/get-job-detail/${id}`,
        method : "GET"
      })
       
      console.log(res)
      setJob(res?.data)
      setSimilarJobs(res?.similarJob)
      setIsLoading(false)

     } catch (error) {
      console.log(error)
      setIsLoading(false)
     }
  }

  useEffect(() => {
    id && fetchJobDetail()
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [id]);

  const handleDeletePost = async ()=> {
    setIsLoading(true)
    const jobId = parseInt(job._id)
    try {
     const res = await apiRequest({
       url : `/job/delete-job/${jobId}` ,
       token : user?.token,
       method : "DELETE"
     })
     
     if(res.success){
      toast.success(res?.message)
      window.location.replace("/")
     }
     setIsLoading(false)

    } catch (error) {
     console.log(error)
     setIsLoading(false)
    }
  }

  if(!job) return <p className="text-center text-gray-500 font-bold mt-10">No Job Details Found</p>
  return (
    <div className='container mx-auto'>
    <div className='w-full flex flex-col md:flex-row gap-10'>
      {/* LEFT SIDE */}
     {isLoading ? <Loading/> :
      <div className='w-full h-fit md:w-2/3 2xl:2/4 bg-white px-5 py-10 md:px-10 shadow-md'>
        <div className='w-full flex items-center justify-between'>
          <div className='w-3/4 flex gap-2'>
            <img
              src={job?.company?.profileUrl}
              alt={job?.company?.name}
              className='w-20 h-20 md:w-24 md:h-20 rounded'
            />

            <div className='flex flex-col'>
              <p className='text-xl font-semibold text-gray-600'>
                {job?.jobTitle}
              </p>

              <span className='text-base'>{job?.location}</span>

              <span className='text-base text-blue-600'>
                {job?.company?.name}
              </span>

              <span className='text-gray-500 text-sm'>
                {moment(job?.createdAt).fromNow()}
              </span>
            </div>
          </div>

          <div className=''>
            <AiOutlineSafetyCertificate className='text-3xl text-blue-500' />
          </div>
        </div>

        <div className='w-full flex flex-wrap md:flex-row gap-2 items-center justify-between my-10'>
          <div className='bg-[#bdf4c8] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-sm text-[#186F65]'>Salary</span>
            <p className='text-lg font-semibold text-[#186F65]'>
              $ {job?.salary}
            </p>
          </div>

          <div className='bg-[#bae5f4] w-40 h-16 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-sm text-[#2192FF]'>Job Type</span>
            <p className='text-lg font-semibold text-[#2192FF]'>
              {job?.jobType}
            </p>
          </div>

          <div className='bg-[#fed0ab] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-sm text-[#F94C10] text-center'>No. of Applicants</span>
            <p className='text-lg font-semibold text-[#F94C10]'>
              {job?.applicants?.length}K
            </p>
          </div>

          <div className='bg-[#cecdff] w-40 h-16 px-6 rounded-lg flex flex-col items-center justify-center'>
            <span className='text-sm text-[#713ABE] text-center'>No. of Vacancies</span>
            <p className='text-lg font-semibold text-[#713ABE]'>
              {job?.vacancies}
            </p>
          </div>
        </div>

        <div className='w-full flex gap-4 py-5'>
          <CustomButton
            onClick={() => setSelected("0")}
            title='Job Description'
            containerStyles={`w-full flex items-center justify-center py-3 px-5 outline-none rounded-full text-sm ${
              selected === "0"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          />

          <CustomButton
            onClick={() => setSelected("1")}
            title='Company'
            containerStyles={`w-full flex items-center justify-center  py-3 px-5 outline-none rounded-full text-sm ${
              selected === "1"
                ? "bg-black text-white"
                : "bg-white text-black border border-gray-300"
            }`}
          />
        </div>

        <div className='my-6'>
          {selected === "0" ? (
            <>
              <p className='text-xl font-semibold'>Job Decsription</p>

              <span className='text-base'>{job?.detail[0]?.desc}</span>

              {job?.detail[0]?.requirements && (
                <>
                  <p className='text-xl font-semibold mt-8'>Requirement</p>
                  <span className='text-base'>
                    {job?.detail[0]?.requirements}
                  </span>
                </>
              )}
            </>
          ) : (
            <>
              <div className='mb-6 flex flex-col'>
                <p className='text-xl text-blue-600 font-semibold'>
                  {job?.company?.name}
                </p>
                <span className='text-base'>{job?.company?.location}</span>
                <span className='text-sm'>{job?.company?.email}</span>
              </div>

              <p className='text-xl font-semibold'>About Company</p>
              <span>{job?.company?.about}</span>
            </>
          )}
        </div>

        <div className='w-full'>
         {
          user?._id === job?.company?._id ?
          <CustomButton
          title='Delete Post'
          onClick={handleDeletePost}
          containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
        />
        :
        <CustomButton
        title='Apply Now'
        containerStyles={`w-full flex items-center justify-center text-white bg-black py-3 px-5 outline-none rounded-full text-base`}
      />
         }
        </div>
      </div>}

      {/* RIGHT SIDE */}
      <div className='w-full md:w-1/3 2xl:w-2/4 p-5 mt-20 md:mt-0'>
        <p className='text-gray-500 font-semibold'>Similar Job Post</p>

        <div className='w-full flex flex-wrap gap-4'>
          {!similarJobs ? <p className="text-gray-500 font-semibold">No Job Found</p> : similarJobs?.slice(0, 6).map((job, index) =>{
            const data = {
              name : job?.company?.name,
              logo : job?.company?.profilUrl,
              ...job
            }
            return  <JobCard job={data} key={index} />

          })}
        </div>
      </div>
    </div>
  </div>  )
}

export default JobDetail