'use client'
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger,SelectValue,SelectItem,SelectGroup,SelectContent,SelectLabel } from "@/components/ui/select"
import axios from "axios";
import { useParams,useRouter } from "next/navigation";
import { useState } from "react"
import toast from "react-hot-toast";






const EditStatus = ()=>{

    const {id} = useParams();
    const router = useRouter()


    const [selectedStatus,setSelectedStatus] = useState('');

    const handleSelectValue = (value)=>{
        setSelectedStatus(value)
        console.log(selectedStatus)
    }

    const handleSubmit = async ()=>{

        try{

            const response = await axios.put(`http://localhost:5454/api/v1/interview/status/${id}`,{
                "status":selectedStatus
            },
            {
                withCredentials:true
            }
        )

        toast.success('Status updated');
        router.push('/dashboard-admin')



        }
        catch(error){
            console.log(error);
            toast.error('Status updated')
        }
    }

    return (
        <div className='flex flex-col justify-center items-center h-[100vh] gap-4'>
        <Select onValueChange={handleSelectValue}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Update the Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
            <SelectItem value="SCHEDULED">SCHEDULED</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Button onClick={handleSubmit} className='bg-orange-500 text-white' >Confirm</Button>
      </div>
    )
}

export default EditStatus