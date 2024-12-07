import { useAppDispatch } from "@/lib/store/hooks"
import { LogOut, LogOutIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { clearUser } from "@/lib/store/features/user/userSlice"
import Cookies from "js-cookie"



const Logout = ()=>{

    const dispatch = useAppDispatch()
    const router = useRouter()





    const handleLogout = ()=>{
        Cookies.remove('jwt');
        router.push('/')
        dispatch(clearUser())
       
        
    }



    return (
        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-white hover:bg-gray-600 hover:text-white">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
   
    )


}

export default Logout