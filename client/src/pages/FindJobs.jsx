import React,{useState,useEffect} from 'react'
import Header from '../components/Header'
import { useLocation, useNavigate } from "react-router-dom";
import { BiBriefcaseAlt2 } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { experience, jobTypes, jobs } from "../utils/data";
import { CustomButton, JobCard, ListBox } from "../components";
import { apiRequest, updateUrl } from '../utils/api';

const FindJobs = () => {
  const [sort,setSort] = useState("Newest")
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);
  const [expVal, setExpVal] = useState([]);

  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const fetchJobs = async () =>{
    setIsFetching(true)
     const newUrl = await updateUrl({
      pageNum:numPage,
      query:searchQuery,
      cmpLoc:jobLocation,
      sort:sort,
      navigate:navigate,
      location:location,
      jType:filterJobTypes,
      exp:filterExp
     });
     try {
      const res = await apiRequest({
        url :"/job" + newUrl,
        method : "GET"
      })
      console.log(res)
      setNumPage(res?.numOfpage)
      setRecordsCount(res?.totalJobs)
      setData(res?.data)
      setIsFetching(false)

     } catch (error) {
      console.log(error)
      setIsFetching(false)

     }
  }

  const filterJobs = (val) =>{
    if(filterJobTypes?.includes(val)){
       setFilterJobTypes(filterJobTypes.filter((item)=> item !== val))
    }else{
      setFilterJobTypes([...filterJobTypes,val])
    }
  }

  const filterExperience = (e) =>{
    if(expVal?.includes(e)){
      setExpVal(expVal.filter((item)=> item !== e))
    }else{
      setExpVal([...expVal,e])
    }
  }
  useEffect(() => {
    if(expVal.length > 0){
      let newExpVal = []
      if (Array.isArray(expVal)) {
        expVal?.map((item)=>{
          const newitem = item.split("-");
          newExpVal.push(Number(newitem[0]), Number(newitem[1]))
        });

      }
     
      newExpVal?.sort((a,b)=>a-b)
      setExpVal(`${newExpVal[0]}-${newExpVal[newExpVal?.length - 1]}`)
    }
    
  }, [expVal])

  useEffect(() => {
    fetchJobs()
  }, [page,sort,filterJobTypes,filterExp])
  
  
  return (
    <div>
      <Header
         title='Find Your Dream Job with Ease'
         type='home'
         handleClick={() => {}}
         searchQuery={searchQuery}
         setSearchQuery={setSearchQuery}
         location={jobLocation}
         setLocation={setJobLocation}/>
         <div className='container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 bg-[#f7fdfd]'>
        <div className='hidden md:flex flex-col w-1/6 h-fit bg-white shadow-sm'>
          <p className='text-lg font-semibold text-slate-600'>Filter Search</p>

          <div className='py-2'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job Type
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {jobTypes.map((jtype, index) => (
                <div key={index} className='flex gap-2 text-sm md:text-base '>
                  <input
                    type='checkbox'
                    value={jtype}
                    className='w-4 h-4'
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='py-2 mt-4'>
            <div className='flex justify-between mb-3'>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>

              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2'>
              {experience.map((exp) => (
                <div key={exp.title} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={exp?.value}
                    className='w-4 h-4'
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p className='text-sm md:text-base'>
              Shwoing: <span className='font-semibold'>{recordsCount}</span> Jobs
              Available
            </p>

            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>

              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4'>
            { !data ? <p className="text-xl text-gray-500 font-bold text-center">No Jobs Found</p>  :
             data?.map((job, index) => {
               const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };
             return  <JobCard job={newJob} key={index} />
            })}
          </div>

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16'>
              <CustomButton
                title='Load More'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FindJobs