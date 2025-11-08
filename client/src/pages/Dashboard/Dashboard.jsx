import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useState,useEffect } from "react";
import {Plus,Trash2,FilePenLine} from "lucide-react"
import * as reportServices from "../../services/reportsService"
import EarthquakeAlertStatus from "../../components/EarthquakeAlertStatus"
// import ReportsModal from "./modal";
import Navbar from "../../components/Navbar";


function Dashboard() {
  const [reports,setReports] = useState("")
  const [isOpen,setIsOpen] = useState(false)
  const [mode,setMode] = useState("")
  const [selectedReport,setSelectedReport] = useState([])
  const [success,setSuccess] = useState("")
  const {user,isAuthenticated,loading } = useAuth();
  const {pageMode,setPageMode} = useState("reports")
 
    useEffect(() =>{
        fetchReports()
    },[])

        
    useEffect(() =>{
      if(success){
        const timer = setTimeout(() => {
          setSuccess("")
        }, 5000);
        return () => clearTimeout(timer)
      }
    },[success])


    const fetchReports = async () =>{
        try {
            const data = await reportServices.getReports()
            const reportsData = data.data.data
            setReports(reportsData)
            console.log(reportsData)
            return reports    
        } catch (error) {
            console.error("Error Fetching Reports",error)
        }  
    }

    const openInsert = async () =>{
        try {
            setIsOpen(true)
            setMode("insert")
        } catch (error) {
            console.error("Error Fetching Reports",error)
        }  
    }
    
    const openUpdate = async (selected) =>{
      try {        
        setSelectedReport(selected)
        setIsOpen(true)
        setMode("update") 
      } catch (error) {
          console.error("Error Fetching Reports",error)
        }  
    }

      const openDelete = async (selected) =>{
        try {
            console.log
            setSelectedReport(selected)
            setIsOpen(true)
            setMode("delete")
        } catch (error) {
            console.error("Error Fetching Reports",error)
        }  
    }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  return (
    <section className="bg-[var(--main-white)] h-screen w-screen flex gap-4 flex-col overflow-y-hidden grid grid-cols-[1fr_9fr]
     grid-rows-[2fr_3fr_5fr] ">
      
        <DashboardSidebar />
        
        <div className="center col-start-2 row-start-1 row-end-2 col-span-full gap-4 full  relative">
            <div className="full shadow-lg rounded-xl center bg-white">a</div>
            <div className="full shadow-lg rounded-xl center bg-white">b</div>
            <div className="full shadow-lg rounded-xl center bg-white">c</div>
        </div>
        
        <main className="bg-white rounded-2xl full shadow-lg column-t row-start-2 row-end-4 col-start-2 col-span-full overflow-hidden p-4" >
    
          <nav className="w-full center h-[10%]   overflow-hidden py-8 px-4 ">
            <div className='full center-l'>Reports</div>
            <div className='full flex items-center justify-start flex-row-reverse'>
              <button onClick={openInsert} className='shadow-lg px-4 py-2  cursor-pointer rounded-xl center 
              hover:bg-[var(--moon-phases-e)] bg-[var(--moon-phases-d)] stroke="#fff"'
              ><Plus size={18}  fill='#fff' /></button>
            </div>
          </nav>

          {success && <div className="center w-full my-4 ">
              <p className="text-[var(--color-success-a)] bg-green-100 p-4 w-full border-2 shadow-lg border-green-500 rounded-xl ">{success}</p>
          </div>}

        
        <div className='column-t overflow-y-auto ' >
          <table className='eq-table table-fixed md:max-w-full md:w-full lg:max-h-full lg:h-full lg:w-full overflow-y-auto'>
            <thead>
              <tr className='tr-th shadow-lg bg-[var(--white-blple)]'>
                <th className='p-4  font-semibold rounded-tl-xl'>Report Title</th>
                <th className='p-4  font-semibold '>Location</th>
                <th className='p-4  font-semibold'>Magnitude</th>
                <th className='p-4  font-semibold'>Description</th>
                <th className='p-4  font-semibold'>Created At</th>
                <th className='p-4  font-semibold w-[25%] rounded-tr-xl'>Action</th>
              </tr>
            </thead>
    
            <tbody className=' overflow-y-auto'>

              {reports.length > 0 && reports.map((r) =>{
                  return (       
                    <tr key={r.report_id}>
                      <td className='text-start p-4  text-sm'>{r.report_title}</td>
                      <td className='text-start p-4  text-sm'>{r.location}</td>
                      <td className='text-start p-4  text-sm'>{r.magnitude}</td>
                      <td className='text-start p-4  text-sm'>{r.description}</td>
                      <td className='text-start p-4  text-sm'>{r.created_at}</td>
                      <td className='text-center p-4  text-sm'>
                        <button  onClick={() => openUpdate(r)}className='hover:shadow-2xl  hover:bg-green-400 text-smmx-2 cursor-pointer shadow-lg bg-[var(--color-success-b)] text-white rounded-xl px-4 py-1'>
                          <FilePenLine size={18}/>
                        </button>
                           <button  onClick={() => openDelete(r)} className=' hover:shadow-2xl hover:bg-red-400 text-sm mx-2 cursor-pointer shadow-lg bg-[var(--color-danger-b)] text-white rounded-xl px-4 py-1'>
                          <Trash2 size={18}/>
                        </button>
                      </td>
                    </tr>          
                  )
                })} 

            </tbody>
               
          </table>
        </div>  
      </main>
{/*     
      {isOpen && 
      <ReportsModal isOpen={setIsOpen}
      mode={mode}
      selectedReport={selectedReport}
      fetchReports={fetchReports}
      setSuccess={setSuccess}
      user={user}
      />} */}


     <EarthquakeAlertStatus />
    </section>
  );
}

export default Dashboard;


