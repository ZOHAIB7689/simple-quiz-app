"use client";

import React, { useState, ChangeEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function WordCounterComponent() {
  const [text, setText] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const clearText = () => {
    setText("");
  };

  const wordCount = text
    .trim()
    .split(/\s+/)
    .filter((word) => word).length;

  const charCount = text.length;

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-gradient-to-br from-emerald-50 to-rose-50 p-4">
      <Card className="w-full bg-gradient-to-bl from-amber-50 to-indigo-50 max-w-md shadow-lg border-2 border-gray-400">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-600">
            Text Analysis
          </CardTitle>
          <CardDescription className="text-gray-500">
            Enter text below to see the word and character count.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            id="text-input"
            placeholder="Start typing your text here..."
            className="h-36 resize-none border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={text}
            onChange={handleTextChange}
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span id="word-count" className="font-semibold text-gray-800">
                {wordCount}
              </span>{" "}
              words
            </div>
            <div>
              <span id="char-count" className="font-semibold text-gray-800">
                {charCount}
              </span>{" "}
              characters
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="px-4 py-2 text-white bg-gray-500 hover:bg-gray-600 rounded-lg"
              onClick={clearText}
            >
              Clear
            </Button>
            <Button
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
              onClick={() => alert("Text Submitted!")}
            >
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
