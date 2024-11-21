"use client";

import React, { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import {
  FlagIcon,
  ArrowLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { authOptions } from "@/src/lib/auth";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "react-quill/dist/quill.snow.css";
interface Question {
  id: string;
  question: string;
  choice: { id: string; text: string }[];
  answer: string[];
  level: string;
  paragraph: string;
}

interface TestResult {
  correctAnswers: number;
  score: number;
  incorrectAnswers: number;
  totalTimeTaken: number;
  accuracy: number;
  userAnswers: string[][];
  question: Question[];
  percentage: number;
}

interface SimulationTestResult {
  isCompleted: boolean;
  singleQuestion: Array<{
    id: string;
    title: string;
    choice: Array<{
      id: string;
      text: string;
    }>;
    answer: string[];
    level?: string; // Add this line
    paragraph: string;
  }>;
  multipleQuestion: Array<{
    id: string;
    title: string;
    choice: Array<{
      id: string;
      text: string;
    }>;
    answer: string[];
    level?: string; // Add this line
    paragraph: string;
  }>;
  userAnswers: string[][];
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  totalTimeTaken: number;
  accuracy: number;
  createdAt: string;
  percentage: number;
}

export interface TestResultsProps {
  testId: string;
  testType: string;
}

const TestResults: React.FC<TestResultsProps> = ({ testId, testType }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [simulationTestResult, setSimulationTestResult] =
    useState<SimulationTestResult | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  //@ts-ignore
  const session = useSession(authOptions);
  const [expandedExplanations, setExpandedExplanations] = useState<{
    [key: string]: boolean;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/test/${testId}/${testType}`);
        const data = await response.json();
        console.log("data", data);
        if (data.err) {
          throw new Error(data.msg);
        }

        // Check if the returned data matches the expected test type
        if (data.data.testType && data.data.testType !== testType) {
          console.warn(
            `Mismatch in test types. Expected: ${testType}, Received: ${data.data.testType}`
          );
          // Handle the mismatch (e.g., update the UI or fetch the correct data)
          // For now, we'll update the testType to match the received data
          testType = data.data.testType;
        }

        if (testType === "TIMER" || testType === "NOTIMER") {
          console.log("Timer test result");

          const {
            question,
            userAnswers,
            score,
            correctAnswers,
            incorrectAnswers,
            totalTimeTaken,
            accuracy,
            percentage,
            paragraph,
          } = data.data;
          console.log("question", question);

          setTestResult({
            correctAnswers,
            score,
            incorrectAnswers,
            totalTimeTaken,
            accuracy,
            userAnswers,
            question,
            percentage,
          });

          console.log("testResult", testResult);

          setQuestions(question);
          console.log("questions set:", question);
        } else if (testType === "SIMULATION") {
          setSimulationTestResult(data.data);
        }

        console.log("TestResult", testResult);
        console.log("SimulationTestResult", simulationTestResult);
        toast.success("Test results loaded successfully!");
      } catch (error) {
        console.error("Failed to load test results:", error);
        toast.error("Failed to load test results");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [testId, testType]);

  // New useEffect to log testResult when it changes
  useEffect(() => {
    if (testResult) {
      console.log("testResult", testResult);
    }
  }, [testResult]);

  const handleFlagClick = (questionId: string) => {
    console.log("session", session);
    console.log("questionId", questionId);
    setSelectedQuestionId(questionId);
    setFeedback("");
    dialogRef.current?.showModal();
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requestBody = {
        questionId: selectedQuestionId,
        flagReason: feedback,
        userId: (session.data?.user as any)?.id,
      };
      console.log("Sending flag request:", requestBody);

      const response = await fetch("/api/flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Flag response:", data);

      if (!response.ok || data.error) {
        throw new Error(data.msg || "Failed to submit flag");
      }

      toast.success("Question flagged successfully!");
      dialogRef.current?.close();
    } catch (error) {
      console.error("Error flagging question:", error);
      toast.error(
        `Failed to flag question: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleExplanation = (questionId: string) => {
    setExpandedExplanations((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100"></div>
        <div className="text-center mt-4 text-xl font-semibold">
          Loading test results...
        </div>
      </div>
    );
  }

  if (!testResult && !simulationTestResult) {
    return <div className="text-center mt-8">No test results available.</div>;
  }

  return (
    <TooltipProvider>
      {/* Wrap your entire component with TooltipProvider */}
      <div className="flex justify-between items-start max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        <div className="flex-grow max-w-3xl mx-auto">
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Test Results</h2>
            {(testType === "TIMER" || testType === "NOTIMER") && testResult && (
              <>
                <p>Total Questions: {testResult.question.length}</p>
                <p>Correct Answers: {testResult.correctAnswers}</p>
                <p>Percentage: {testResult.percentage}%</p>
                <div className="mt-6">
                  {testResult.question.map((question, index) => (
                    <div
                      key={question.id}
                      className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg relative"
                    >
                      <h3 className="text-xl font-semibold mb-2">
                        Question {index + 1}
                        {question.level && (
                          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                            (Level: {question.level})
                          </span>
                        )}
                      </h3>
                      <p className="mb-2">{question.question}</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <FlagIcon
                            className="h-6 w-6 absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                            onClick={() => handleFlagClick(question.id)}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                          <p>Report to admin</p>
                        </TooltipContent>
                      </Tooltip>
                      <div className="space-y-2">
                        {question.choice.map((choice) => (
                          <div
                            key={choice.id}
                            className={`p-2 rounded ${
                              question.answer.includes(choice.id)
                                ? "bg-green-200 dark:bg-green-700"
                                : testResult.userAnswers[index]?.includes(
                                      choice.id
                                    )
                                  ? "bg-red-200 dark:bg-red-700"
                                  : "bg-white dark:bg-gray-700"
                            }`}
                          >
                            {choice.text}
                            {question.answer.includes(choice.id) && " ✓"}
                            {testResult.userAnswers[index]?.includes(
                              choice.id
                            ) &&
                              !question.answer.includes(choice.id) &&
                              " ✗"}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <button
                          onClick={() => toggleExplanation(question.id)}
                          className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <span className="font-semibold mr-2">Paragraph</span>
                          <ChevronDownIcon
                            className={`h-5 w-5 transform transition-transform ${
                              expandedExplanations[question.id]
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        {expandedExplanations[question.id] && (
                          <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded border border-red-400">
                            <ParagraphViewer content={question.paragraph} />{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {testType === "SIMULATION" && simulationTestResult && (
              <>
                <p>
                  Total Questions:{" "}
                  {simulationTestResult.singleQuestion.length +
                    simulationTestResult.multipleQuestion.length}
                </p>
                <p>Percentage: {simulationTestResult.percentage} %</p>
                <p>Correct Answers: {simulationTestResult.correctAnswers}</p>
                {/* <p>Score: {simulationTestResult.score.toFixed(2)}%</p>
                <p>Accuracy: {simulationTestResult.accuracy.toFixed(2)}%</p>
                <p>
                  Total Time Taken: {simulationTestResult.totalTimeTaken}{" "}
                  seconds
                </p> */}
                <div className="mt-6">
                  {simulationTestResult.singleQuestion.map(
                    (question, index) => (
                      <div
                        key={`${question.id}`}
                        className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg relative"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          Question {index + 1} (Single)
                          {question.level && (
                            <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                              (Level: {question.level})
                            </span>
                          )}
                        </h3>
                        <p className="mb-2">{question.title}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FlagIcon
                              className="h-6 w-6 absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                              onClick={() => handleFlagClick(`${question.id}`)}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                            <p>Report to admin</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="space-y-2">
                          {question.choice.map((choice) => (
                            <div
                              key={choice.id}
                              className={`p-2 rounded ${
                                question.answer.includes(choice.id)
                                  ? "bg-green-200 dark:bg-green-700"
                                  : simulationTestResult.userAnswers[
                                        index
                                      ]?.includes(choice.id)
                                    ? "bg-red-200 dark:bg-red-700"
                                    : "bg-white dark:bg-gray-700"
                              }`}
                            >
                              {choice.text}
                              {question.answer.includes(choice.id) && " ✓"}
                              {simulationTestResult.userAnswers[
                                index
                              ]?.includes(choice.id) &&
                                !question.answer.includes(choice.id) &&
                                " ✗"}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExplanation(question.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                          >
                            <span className="font-semibold mr-2">
                              Explanation
                            </span>
                            <ChevronDownIcon
                              className={`h-5 w-5 transform transition-transform ${
                                expandedExplanations[question.id]
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedExplanations[question.id] && (
                            <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                              <ParagraphViewer content={question.paragraph} />{" "}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                  {simulationTestResult.multipleQuestion.map(
                    (question, index) => (
                      <div
                        key={`${question.id}`}
                        className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg relative"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          Question{" "}
                          {simulationTestResult.singleQuestion.length +
                            index +
                            1}{" "}
                          (Multiple)
                          {question.level && (
                            <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">
                              (Level: {question.level})
                            </span>
                          )}
                        </h3>
                        <p className="mb-2">{question.title}</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <FlagIcon
                              className="h-6 w-6 absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                              onClick={() => handleFlagClick(`${question.id}`)}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
                            <p>Report to admin</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="space-y-2">
                          {question.choice.map((choice) => (
                            <div
                              key={choice.id}
                              className={`p-2 rounded ${
                                question.answer.includes(choice.id)
                                  ? "bg-green-200 dark:bg-green-700"
                                  : simulationTestResult.userAnswers[
                                        simulationTestResult.singleQuestion
                                          .length + index
                                      ]?.includes(choice.id)
                                    ? "bg-red-200 dark:bg-red-700"
                                    : "bg-white dark:bg-gray-700"
                              }`}
                            >
                              {choice.text}
                              {question.answer.includes(choice.id) && " ✓"}
                              {simulationTestResult.userAnswers[
                                simulationTestResult.singleQuestion.length +
                                  index
                              ]?.includes(choice.id) &&
                                !question.answer.includes(choice.id) &&
                                " ✗"}
                            </div>
                          ))}
                        </div>
                        <div className="mt-4">
                          <button
                            onClick={() => toggleExplanation(question.id)}
                            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                          >
                            <span className="font-semibold mr-2">
                              Explanation
                            </span>
                            <ChevronDownIcon
                              className={`h-5 w-5 transform transition-transform ${
                                expandedExplanations[question.id]
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </button>
                          {expandedExplanations[question.id] && (
                            <div className="mt-2 p-2 bg-gray-200 dark:bg-gray-700 rounded">
                              <ParagraphViewer content={question.paragraph} />{" "}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <dialog
        ref={dialogRef}
        className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 max-w-md w-full"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Submit Feedback
        </h3>
        <form onSubmit={handleSubmitFeedback}>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full h-32 p-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder="Enter your feedback here..."
            required
            disabled={isSubmitting}
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </dialog>
    </TooltipProvider>
  );
};

export default TestResults;
interface ParagraphViewerProps {
  content: string;
}
function ParagraphViewer({ content }: ParagraphViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        const newHeight = contentRef.current.scrollHeight;
        setContentHeight(newHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [content]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mt-2 p-4 rounded bg-white text-black">
        <div
          ref={contentRef}
          className="prose prose-sm max-w-none dark:prose-invert overflow-y-auto ql-editor custom-quill-content"
          style={{
            height: contentHeight ? `${contentHeight}px` : "auto",
            maxHeight: "calc(90vh - 120px)",
            padding: "1rem",
            backgroundColor: "var(--background)",
            borderRadius: "0.5rem",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
