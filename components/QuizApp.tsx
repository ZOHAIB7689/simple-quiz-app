"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ClipLoader } from "react-spinners";

type Answer = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  question: string;
  answers: Answer[];
};

type QuizState = {
  currentQuestion: number;
  score: number;
  showResults: boolean;
  questions: Question[];
  isLoading: boolean;
};

export default function QuizApp() {
  const [state, setState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    showResults: false,
    questions: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&type=multiple"
        );
        const data = await response.json();
        const questions = data.results.map((item: any) => {
          const incorrectAnswers = item.incorrect_answers.map(
            (answer: string) => ({
              text: answer,
              isCorrect: false,
            })
          );
          const correctAnswer = { text: item.correct_answer, isCorrect: true };
          return {
            question: item.question,
            answers: [...incorrectAnswers, correctAnswer].sort(
              () => Math.random() - 0.5
            ),
          };
        });
        setState((prevState) => ({
          ...prevState,
          questions,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerClick = (isCorrect: boolean): void => {
    if (isCorrect) {
      setState((prevState) => ({ ...prevState, score: prevState.score + 1 }));
    }
    const nextQuestion = state.currentQuestion + 1;
    if (nextQuestion < state.questions.length) {
      setState((prevState) => ({
        ...prevState,
        currentQuestion: nextQuestion,
      }));
    } else {
      setState((prevState) => ({ ...prevState, showResults: true }));
    }
  };

  const resetQuiz = (): void => {
    setState((prevState) => ({
      currentQuestion: 0,
      score: 0,
      showResults: false,
      questions: prevState.questions,
      isLoading: false,
    }));
  };

  if (state.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <ClipLoader size={50} color="#ffffff" />
        <p className="mt-4 text-xl font-semibold">Loading quiz questions...</p>
      </div>
    );
  }

  if (state.questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <p className="text-2xl font-bold">
          No questions available. Please try again later.
        </p>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-600 p-4 text-white">
      {state.showResults ? (
        <div className="bg-white text-black rounded-lg shadow-lg p-8 w-full max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Quiz Results</h2>
          <p className="text-xl mb-6">
            You scored{" "}
            <span className="font-bold text-green-500">{state.score}</span> out
            of {state.questions.length}
          </p>
          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:opacity-90"
            onClick={resetQuiz}
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="bg-white/50 border-2 border-white text-black rounded-lg shadow-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">
            Question {state.currentQuestion + 1}/{state.questions.length}
          </h2>
          <p
            className="text-lg mb-6"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
          <div className="space-y-4">
            {currentQuestion.answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer.isCorrect)}
                className="w-full bg-blue-100 text-blue-900 py-2 px-4 rounded-lg hover:bg-blue-200"
              >
                {answer.text}
              </Button>
            ))}
          </div>
          <div className="mt-6 text-right text-lg">
            <span className="text-gray-700">Score: {state.score}</span>
          </div>
        </div>
      )}
    </div>
  );
}
