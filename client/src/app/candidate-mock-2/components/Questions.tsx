import React, { useState } from 'react';

const QuestionsList = ({ generatedQuestions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < generatedQuestions?.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {generatedQuestions?.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold">
            {generatedQuestions[currentIndex].question}
          </h1>
          <p className="text-xs">
            {generatedQuestions[currentIndex].ai_ans}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === generatedQuestions?.length - 1}
          className="bg-blue-500 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p className="text-sm">
        Question {currentIndex + 1} of {generatedQuestions?.length}
      </p>
    </div>
  );
};

export default QuestionsList;
