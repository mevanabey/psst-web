'use client';

import { useState, useEffect } from 'react';
import { useConversation } from '@11labs/react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from "@/lib/utils";
import Link from "next/link";

// Define types for conversation messages based on what the library returns
interface ConversationMessage {
  message: string;
  source: string;
  [key: string]: any;
}

export default function VoiceTest() {
  const [micPermission, setMicPermission] = useState<boolean>(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [volume, setVolume] = useState<number>(0.5);
  
  // Hard-coded Agent ID
  const agentId = "vVTae2VKmQKeWlApMmwK";
  
  const conversation = useConversation({
    onConnect: () => console.log('Connected to voice agent'),
    onDisconnect: () => console.log('Disconnected from voice agent'),
    onMessage: (props) => {
      console.log('New message:', props);
      setMessages(prev => [...prev, props]);
    },
    onError: (message, context) => console.error('Error:', message, context)
  });
  
  const { status, isSpeaking } = conversation;
  
  const isConnected = status === 'connected';

  // Force a refresh on initial load to ensure layout consistency
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const toggleConversation = async () => {
    if (!isConnected) {
      if (!micPermission) {
        await requestMicrophoneAccess();
      }
      
      try {
        const conversationId = await conversation.startSession({ agentId });
        console.log('Started conversation with ID:', conversationId);
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    } else {
      try {
        await conversation.endSession();
        console.log('Conversation ended');
      } catch (error) {
        console.error('Failed to end conversation:', error);
      }
    }
  };
  
  const adjustVolume = async (newVolume: number) => {
    try {
      setVolume(newVolume);
      await conversation.setVolume({ volume: newVolume });
    } catch (error) {
      console.error('Failed to adjust volume:', error);
    }
  };
  
  return (
    <div className="flex flex-col mt-20">
      <Link href="/" className="fixed top-4 left-3 z-[100] text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </motion.div>
      </Link>
      
      <div className="max-w-xl w-full mx-auto px-6 flex-1 sm:mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1 tracking-tight">Voice Agent Test</h1>
        </motion.div>
        
        <div className="space-y-8 mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 p-6 rounded-lg space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Voice Assistant</h3>
                    <p className="text-sm text-zinc-400">Using agent: {agentId}</p>
                  </div>
                  <div className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    isConnected 
                      ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                      : "bg-zinc-500/20 text-zinc-300 border border-zinc-500/30"
                  )}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-zinc-400">
                      Volume:
                    </label>
                    <span className="text-sm text-zinc-400">{Math.round(volume * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1" 
                    value={volume}
                    onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                    className="w-full bg-white/10 rounded-lg h-2 appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <motion.button
                    type="button"
                    onClick={toggleConversation}
                    className={cn(
                      "w-full px-8 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-2",
                      isConnected
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-white text-black hover:bg-gray-200"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isConnected ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                        End Conversation
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="22"></line>
                        </svg>
                        Start Conversation
                      </>
                    )}
                  </motion.button>
                  
                  {isSpeaking && (
                    <div className="flex justify-center mt-4">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "100ms" }}></div>
                        <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
                        <div className="w-1 h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
                        <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
                        <div className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: "500ms" }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-4">Conversation</h3>
                <div className="border border-white/10 rounded-lg p-4 h-64 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-zinc-500 text-center py-4">Start a conversation to see messages</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium text-xs text-zinc-400 mb-1">
                            {msg.source === 'user' ? 'You' : 'Assistant'}:
                          </div>
                          <div className="bg-white/5 rounded p-3 break-words">
                            {msg.message || JSON.stringify(msg)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
