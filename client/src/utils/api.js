import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const API =  axios.create({
    baseURL : API_URL,
    responseType : 'json'
})

export const apiRequest = async ({url,token,data,method}) =>{

    try {
        const result = await API(url, {
            method:  method || "GET",
            data : data,
            headers : {
                "Content-Type"  :"application/json",
                Authorization : token ? `Bearer ${token}` : ""
            }
        });
        return result?.data;
    } catch (error) {
        const err = error.response.data
        return {
            status : err.success,message : err.message
        }
    }
}



export const handleFIileUpload = async (uploadUrl) =>{

    try {
       
        const formData = new FormData()
        formData.append("file", uploadUrl)
        formData.append("upload_preset", "deepak_preset")
        const res = await axios.post(`https://api.cloudinary.com/v1_1/deepak-cloud/image/upload `,
        formData);
        return res.data.secure_url;
    } catch (error) {
        console.log(error)
    }
}


export const updateUrl = async ({
    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    jType,
    exp
}) =>{

    const params = new URLSearchParams()
    if(pageNum  && pageNum > 1 ){
        params.set("page", pageNum)
    }
    if(cmpLoc ){
      params.set("cmpLoc", cmpLoc)
    }
    if(query){
        params.set("query", query)
    }
    if(sort){
        params.set("sort", sort)
    }
    if(jType){
        params.set("jType", jType)
    }
    if(exp){
        params.set("exp", exp)
    }
    const newUrl = `${location.pathname}?${params.toString()}`
    navigate(newUrl,{replace : true})
    return newUrl;
}