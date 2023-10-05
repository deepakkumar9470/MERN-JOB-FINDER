import React from 'react'
import { Link } from 'react-router-dom'

const CompanyCard = ({company}) => {
  return (
<div className='w-full h-16 flex gap-4  items-center justify-between bg-white shadow-md rounded'>
      <div className='w-3/4 md:w-2/4 flex gap-4 items-center px-2'>
        <Link to={`/company-profile/${company?._id}`}>
          <img
            src={company?.profileUrl ? company?.profileUrl: "https://images.pexels.com/photos/17362982/pexels-photo-17362982/free-photo-of-logo-of-a-british-automotive-company-on-the-hood-of-a-car.jpeg?auto=compress&cs=tinysrgb&w=600"}
            alt={company?.name}
            className='w-6 md:w-10 h-6 md:h-10 rounded'
          />
        </Link>
        <div className='h-full flex flex-col'>
          <Link
            to={`/company-profile/${company?._id}`}
            className='text-base md:text-lg font-semibold text-gray-600 truncate'
          >
            {company?.name}
          </Link>
          <span className='text-sm text-blue-600'>{company?.email}</span>
        </div>
      </div>

      <div className='hidden w-1/4 h-full md:flex items-center'>
        <p className='text-base text-start'>{company?.location}</p>
      </div>

      <div className='w-1/4 h-full flex flex-col items-center'>
        <p className='text-blue-600 font-semibold'>{company?.jobPosts?.length}</p>
        <span className='text-xs md:base font-normal text-gray-600'>
          Jobs Posted
        </span>
      </div>
    </div>  )
}

export default CompanyCard