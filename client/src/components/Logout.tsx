import { useAppDispatch } from "@/lib/store/hooks"
import { LogOutIcon } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { clearUser } from "@/lib/store/features/user/userSlice"
import Cookies from "js-cookie"



const Logout = ()=>{

    const dispatch = useAppDispatch()
    const router = useRouter()





    const handleLogout = ()=>{
        dispatch(clearUser())
        Cookies.remove('jwt');
        router.push('/')
    }



    return (
        <Button onClick={handleLogout} className='flex h-auto w-auto  bg-white gap-2 text-xs text-red-500  items-center justify-center hover:text-white hover:bg-red-500  '>
        <span className='font-medium'>Logout</span>
        <LogOutIcon height={20} width={20}></LogOutIcon>
      </Button>
   
    )


}

export default Logout