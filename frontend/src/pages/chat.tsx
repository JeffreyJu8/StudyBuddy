import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const CHAT_URL = 'http://34.217.210.224:3000/chat';

function ChatPage(){
    const [prompt, setPrompt] = useState<string>('');
    const [reply, setReply] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    const handleSubmit = async (event: { preventDefault: () => void; })=> {

        const token = localStorage.getItem('token');
        
        if (!token) {
            setError('Not logged in');
            return;
        }

        console.log(token);

        event.preventDefault();
        setError('');

        try{
            if(!prompt){
              throw new Error("Prompt is required");
            }
            const response = await axios.post(
                CHAT_URL,
                { prompt },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setReply(response.data.reply);
        }catch(err){
            setError(err.message);
        }
    }

    return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 py-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md space-y-6">
          <h3 id="question-heading" className="text-3xl font-semibold text-gray-800 text-center">
              Hello, I am StudyBuddy AI. 
          </h3>
          <p className="text-lg text-gray-700 text-center">
            I can answer your questions on any topic. Simply type your question and hit the submit button
          </p>
          <form className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4" onSubmit={handleSubmit}>
              <textarea
                  id="prompt-area"
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-gray-300 focus:border-blue-500"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3} 
                  placeholder="Type your question here..."
                  required
              />
              <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
                  id="submit-prompt"
                  type="submit"
              >
                  Submit
              </button>
          </form>
          {error && <p className="text-red-500 font-bold mt-4 text-center">{error}</p>}
  
          {reply && (
              <div id="reply-container" className="bg-gray-50 rounded-md p-4 shadow-inner">
                  <h3 id="reply-block" className="text-lg font-semibold text-blue-600 mb-2">
                      StudyBuddy Says:
                  </h3>
                  <div className="prose prose-sm md:prose">
                      <ReactMarkdown>{reply}</ReactMarkdown>
                  </div>
              </div>
          )}
    </div>
    </div>
    );
}

export default ChatPage;