import { useEffect, useState } from "react"
import * as  reportServices from "../../services/reportsService"

function ReportsModal({isOpen,mode,selectedReport,fetchReports,setSuccess,user}) {
const [formData,setFormData] = useState({
                                         user_id:0,
                                         report_title:"",
                                         location: "",
                                         magnitude: 0,
                                         description: ""
                                        })
  const [fieldError,setFieldError] = useState({})
  
    useEffect(() =>{
    if(mode === "update" && selectedReport){
      setFormData({ 
        user_id:user.id,
        report_title:selectedReport.report_title,
        location: selectedReport.location,
        magnitude: selectedReport.magnitude,
        description:selectedReport.description})   

    }else if(mode === "insert"){
      setFormData({    
                    user_id:user.id,
                    report_title: "",
                    location: "",
                    magnitude: "",
                    description:""})              

    }    
  },[mode,selectedReport,isOpen])

    
  const handleChange = (e) =>{
      const {name,value} = e.target
      setFormData(prev =>({
        ...prev, [name]:value    
      })    
    )
    if(value.trim() !== "" ){
         setFieldError(prev => ({
      ...prev,[name]:value === ""
      }))
    }    
  }

  const handleSubmit = async (e) =>{
    e.preventDefault()
    
    try { 
        if(mode === "insert"){
            await reportServices.insertReports(formData)
            isOpen(false)
            await fetchReports()
            setSuccess(`${formData.report_title} Report Added Sucessfullly`)
        }else if(mode === "update"){
            const updatedUser =  await reportServices.UpdateReports(formData,selectedReport.report_id)
            console.log("SELECTED REPORT",selectedReport.report_id)
            console.log("FORM DATA",formData)

            isOpen(false)
            console.log("UPDATED USER",updatedUser)
            await fetchReports()
            setSuccess(`${formData.report_title}Report Upadted Sucessfullly`)
        }else{
           await reportServices.deleteReports(selectedReport.report_id)
           isOpen(false)
           await fetchReports()
           setSuccess(`${selectedReport.report_title} Deleted Sucessfullly`)
        }      
    } catch (error) {
        console.error(error)
    }
  }

 if(!isOpen) return null

  return (
    <section className="center h-screen w-screen absolute top-0 bg-transparent backdrop-blur-2xl">

          <main className={`container column-t z-10 w-[90%] md:w-[80%] lg:w-[50%] h-[50%] ${mode === "delete" ? "h-[300px]" : "h-[50%]"} bg-white rounded-lg shadow-lg overflow-hidden`}>

            <div className={`modal-header flex items-center justify-between w-full h-20 overflow-hidden
            ${mode === "update" ? "bg-blue-100" : mode === "insert" ? "bg-gray-100" : "bg-red-100"} `}>
                <p className="modal-text mx-4 text-2xl">{mode === "insert" ? "Insert Eearthquake Reports" : mode === "update" ? "Update Earthquake Reports" : "Delete Earthquake Reports User"}</p> 
                <button className="mx-4 rounded-2xl hover:bg-[var(--white-blple)] px-4 py-2 bg-gray-100 shadow-lg  cursor-pointer" onClick={() => isOpen(false)}>X</button>
            </div> 

            {mode === "delete" ? (
                <div className="full column">
                  <p>Are you sure you want to delete {selectedReport.report_title}</p>
                  <button onClick={handleSubmit} className="bg-red-200 px-4 py-1 rounded-2xl my-4 shadow-xl">Delete</button>
                </div>
            ):(

              <form onSubmit={handleSubmit} className="user_form full grid grid-cols-2 grid-rows-[8fr_2fr]">

            
                  <div className="flex items-center justify-evenly flex-col  full">

                        <input  onChange={handleChange} value={formData.user_id} className="hidden border-2" type="text"/>

                     <div className="flex items-center justify-evenly flex-col full ">
                        <div className="input-box column relative">
                            <input name="report_title" onChange={handleChange} value={formData.report_title} 
                            className="text-sm rounded-lg border-1 border-gray-500 px-2 py-1" 
                            placeholder="" type="text"/>     
                             <label className="absolute left-4 top-1  text-sm text-[var(--metal-dark4)] pointer-events-none bg-white px-2">
                               Report Title
                            </label>          
                        </div>

                        
                        <div className="input-box column relative">
                        <input name="location" onChange={handleChange} value={formData.location} className="text-sm rounded-lg border-1 border-gray-500 px-2 py-1" 
                                placeholder="" type="text"/>
                            <label className="absolute left-4 top-1 text-sm text-[var(--metal-dark4)] pointer-events-none bg-white px-2">
                                Location
                            </label>      
                        </div>

                    </div>

                  
                  </div>

                    <div className="flex items-center justify-evenly flex-col  full ">
                        <div className="input_box flex items-start justify-start flex-col relative">
                                  
                            <input type="number" name="magnitude" onChange={handleChange} 
                            value={formData.magnitude} placeholder="Magnitude"  className="number-input text-sm rounded-lg border-1 border-gray-500 px-2 py-1"  />
                       

                        </div>

                        <div className="input-box column relative">
                            <input name="description" onChange={handleChange}
                             value={formData.description} 
                            className="text-sm rounded-lg border-1 border-gray-500 px-2 py-1" 
                            placeholder=" " type="text"/>  
                            <label className="absolute left-4 top-1 text-sm text-[var(--metal-dark4)] pointer-events-none bg-white px-2">
                               Description
                            </label>           
                        </div>
                    </div>
                    
                  
                 

                  <div className="center-r col-span-full">
                    <a onClick={() => isOpen(false)} className="text-sm border-1px px-4 mx-4 rounded-10px rounded-lg cursor-pointer  ">Cancel</a>
                    <button type="submit" className={`text-sm cursor-pointer px-4 py-1 rounded-lg shadow-xl mr-8
                      ${mode === "insert" ? "bg-gray-500 text-white" : mode === "update" ? "bg-blue-200" : "bg-red-200"}`}>
                      {mode === "insert" ? "Insert" : mode === "update" ? "Update" : "Delete"}
                    </button>
                  </div>
                 


              </form>
            ) }               
        </main>

    </section>
  )
}

export default ReportsModal