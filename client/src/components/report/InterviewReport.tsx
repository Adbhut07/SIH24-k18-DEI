import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface InterviewReportProps {
  candidateName: string
  interviewerName: string
  jobDescription: string
  candidateSkills: string[]
  totalQuestions: number
  questionCategories: string[]
  performanceData: {
    topic: string
    score: number
  }[]
}

export default function InterviewReport({
  candidateName,
  interviewerName,
  jobDescription,
  candidateSkills,
  totalQuestions,
  questionCategories,
  performanceData,
}: InterviewReportProps) {
  const chartData = {
    labels: performanceData.map((item) => item.topic),
    datasets: [
      {
        label: 'Performance Score',
        data: performanceData.map((item) => item.score),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Performance Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Topics Covered',
        },
      },
    },
  }

  const downloadPDF = () => {
    const input = document.getElementById('interview-report')
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 30
        pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save('interview_report.pdf')
      })
    }
  }

  return (
    <div id="interview-report" className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Candidate Interview Performance Report</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Candidate Details</h2>
        <p><strong>Candidate Name:</strong> {candidateName}</p>
        <p><strong>Interviewer Name:</strong> {interviewerName}</p>
        <p><strong>Job Description:</strong> {jobDescription}</p>
        <div>
          <strong>Candidate Skills:</strong>
          <ul className="list-disc list-inside">
            {candidateSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Interview Summary</h2>
        <p><strong>Total Number of Questions Asked:</strong> {totalQuestions}</p>
        <div>
          <strong>Question Categories:</strong>
          <ul className="list-disc list-inside">
            {questionCategories.map((category, index) => (
              <li key={index}>{category}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Insights – Topics to Improve</h2>
        <p>The following chart illustrates the candidate's performance across various topics, highlighting areas for potential improvement:</p>
        <div className="mt-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </section>

      <Button onClick={downloadPDF} className="mt-4">Download PDF</Button>
    </div>
  )
}

