import { useState,useEffect } from "react";
import {Sun,MoonStar} from "lucide-react"
import "./darkmode.css"

export function Darkmode(){
    const [dark,setDark] =  useState(() =>{
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : false
    })

    useEffect(() =>{
        if(dark){
            document.body.classList.add("dark")
            document.body.classList.remove("light")
            localStorage.setItem("theme","dark")
            const state = localStorage.getItem("theme")
            console.log(state)
        }else{
            document.body.classList.add("light")
            document.body.classList.remove("dark")
            localStorage.setItem("theme","light")
            const state = localStorage.getItem("theme")
            console.log(state)
        }
    },[dark])
    
    return(<>
        <div className="dmode-box center-l px-4 py-1 w-20 rounded-lg shadow-lg px-2 py-2">
            <button onClick={() => setDark(!dark)} 
            className="dmode-btn w-5 h-5 rounded-full cursor-pointer">{!dark ? <Sun className="sun"/> : <MoonStar className="moonstar"/> }</button>
        </div>  
    </>)

}