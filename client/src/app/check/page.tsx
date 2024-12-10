// 'use client'
// import React, { useEffect, useState } from 'react';
// import { supabase, setSupabaseToken } from '../../lib/supabase'
// import Cookies from 'js-cookie';
// import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
// import { updateUserImage } from '@/lib/store/features/user/userSlice';

// const Check = () => {

//   const user = useAppSelector((state) => state.user);
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [url, setUrl] = useState(user.image);


 
//   const dispatch = useAppDispatch();

//   console.log(user.image)



//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFile(selectedFile);
//   };

//   // Upload file to Supabase
//   const uploadFile = async () => {
//     if (!file) {
//       alert('Please select a file to upload.');
//       return;
//     }



//     setUploading(true);


//     const fileName = `${Date.now()}-${file.name}`;

//     try {
//       // Upload the file to Supabase Storage
//       const { data, error } = await supabase.storage
//         .from('sih-profile') // Replace with your storage bucket name
//         .upload(`${user.id}/${fileName}`, file);

//       if (error) throw error;

//       // Get the public URL of the uploaded file
//       const fileUrl = supabase.storage.from(`sih-profile/${user.id}`).getPublicUrl(fileName)
//       setUrl(fileUrl?.data?.publicUrl);
//       console.log(fileUrl)

//       alert('File uploaded successfully!');
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Error uploading file.');
//     } finally {
//       setUploading(false);
//     }
//   };


//   useEffect(()=>{
//    dispatch(updateUserImage({image:url}))

//   },[url])

//   return (
//     <div>
//       <h1>Upload Photo</h1>
//       <input type="file" onChange={handleFileChange} />
//       <button onClick={uploadFile} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload'}
//       </button>

//       {url && (
//         <div>
//           <h3>Uploaded File:</h3>
//           <h1>hey</h1>
//           <img src={url} alt="Uploaded File" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default Check;





'use client'

import axios from "axios";
import OpenAI from "openai";
import { useEffect, useState } from "react";


const Check = () => {

  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [currentMarks, setCurrentMarks] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  const interviewId = "90e0f4cd-51af-44a3-95b2-26dfe9a473cb"

  // Candidate skills (replace with actual skills)
const candidateSkills = "JavaScript, React, Node.js, SQL, Data Structures";


  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true 
  })

  const prompt = `Generate 10 interview questions related to these skills: ${candidateSkills}.

Return the result as a **valid JSON array** where each element is a JSON object. Ensure the JSON is properly formatted with no syntax errors. Each object should have the following fields:

- **"question"**: A string representing the interview question.
- **"topic"**: A string indicating the specific topic related to the skills.
- **"relevance"**: A string indicating the relevance of the question to the skills (must be one of: "high", "medium", "low").
- **"toughness"**: An integer between 1 and 5 indicating the toughness of the question.
- **"difficulty"**: A string indicating the difficulty level (must be one of: "easy", "intermediate", "hard").
- **"category"**: A string representing a general category or subfield related to the question.
- **"ai_answer"**: A string containing a detailed AI-generated answer (approximately 3-5 sentences).

DO NOT ADD ANY OTHER COMMENTS OR TEXT IN THE RESPONSE, I JUST WANT THE JSON ARRAY. 

**Example Output:**
[
  {
    "question": "What is the time complexity of a binary search algorithm?",
    "topic": "Algorithms",
    "relevance": "high",
    "toughness": 3,
    "difficulty": "intermediate",
    "category": "Computer Science",
    "ai_answer": "The time complexity of a binary search algorithm is O(log n). Binary search works by repeatedly dividing the search interval in half, which allows it to quickly narrow down the target value. This efficiency makes it ideal for searching in sorted datasets."
  },
  {
    "question": "How does a convolutional neural network (CNN) process image data?",
    "topic": "Machine Learning",
    "relevance": "high",
    "toughness": 4,
    "difficulty": "hard",
    "category": "Deep Learning",
    "ai_answer": "A CNN processes image data by applying convolutional filters to extract features such as edges and textures. These features are then passed through multiple layers of convolution, pooling, and fully connected layers. This structure helps the network learn hierarchical patterns in the image, which is crucial for tasks like object detection and image classification."
  }
]
`

  async function getSuggestedQuestions() {
    try {
      // Call OpenAI API to fetch suggested questions
      const completion = await openai.chat.completions.create({
        model: "meta-llama/llama-3.2-3b-instruct:free",
        messages: [
          {
            role: "user",
            content: prompt,
           },
        ],
      });
  
      const responseContent = completion?.choices?.[0]?.message?.content;
      if (!responseContent) {
        throw new Error("No content received from the AI model.");
      }
  
       console.log(responseContent)
  
      const parsedQuestions = JSON.parse(responseContent+']');
      console.log(parsedQuestions)
  
      // Update state with the parsed questions
      setSuggestedQuestions(parsedQuestions);
      setCurrentQuestion(parsedQuestions[0]);
  
      
  
      if (parsedQuestions.length === 0) {
        console.warn("No valid questions could be parsed from the response.");
      } else {
        console.log("Parsed Questions:", parsedQuestions);
      }
    } catch (error: any) {
      console.error("Error in getSuggestedQuestions:", error.message);
    }
  }


  
useEffect(() => {

  getSuggestedQuestions()

},[])



const handleEvaluateQuestion = async()=>{

  const data = {
    interviewId: interviewId,
    questionDetails: [
      {
        question: currentQuestion?.question,
        ideal_ans: currentQuestion?.ai_answer,
        toughness: currentQuestion?.toughness,
        relevancy: currentQuestion?.relevance,
        category: currentQuestion?.category,
        topic: currentQuestion?.topic,
        feedback_ai: "Feedback is worst",
        marks_given_by_interviewers: [
          {
            interviewerId: "0a33959f-c695-4a97-bf6e-f190c275990f",
            score: Number(currentMarks),
          },
        ],
      },
    ],
  };
  try{

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/v1/evaluation`,data,{withCredentials:true})
    console.log("evaluated" ,response)





  }
  catch(error){
    console.log(error)
  }

}






  return (

    <div>

          <h1>{currentQuestion?.question}</h1>

          <input onChange={(e)=>setCurrentMarks(Number(e.target.value))}  min={0} max={10} type="number" className="boder-2 border " />
          <button onClick={handleEvaluateQuestion}>Evaluate</button>
      </div>

  )


}

export default Check
