'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

// Common support topics with quick actions
const QUICK_ACTIONS = [
  {
    title: 'Order Issues',
    description: 'Track, modify, or cancel an order',
    icon: '📦'
  },
  {
    title: 'Account & Payment',
    description: 'Manage account settings and payment methods',
    icon: '💳'
  },
  {
    title: 'GrassPass',
    description: 'Subscription benefits and billing',
    icon: '🌿'
  },
  {
    title: 'MMCC Verification',
    description: 'Help with ID verification',
    icon: '🆔'
  }
];

// Frequently asked questions
const FAQS = [
  {
    question: 'How do I track my order?',
    answer: 'You can track your order in real-time by clicking on "View Order" from the home screen or checking your order history.'
  },
  {
    question: 'What is GrassPass?',
    answer: 'GrassPass is our membership program that offers free delivery, priority dispatch, and exclusive discounts for a monthly or annual fee.'
  },
  {
    question: 'How do I update my delivery address?',
    answer: 'Go to Account > Address to add or update your delivery addresses. All addresses require verification for compliance.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, ACH bank transfers, and cryptocurrency. Credit card payments coming soon!'
  }
];

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
};

export default function Help() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user?.name || 'there'}! I'm your GrassApp Assistant. How can I help you today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand you need help. Let me assist you with that. Our support team is working on implementing AI responses. For now, please use the quick actions above or contact our support team.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (title: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `I need help with ${title}`,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response based on quick action
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'll help you with ${title}. Please let me know your specific concern.`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-lg border-b border-grass-primary/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:text-grass-primary transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">Help & Support</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              onClick={() => handleQuickAction(action.title)}
              className="bg-grass-bg-light p-4 rounded-xl hover:bg-grass-bg-light/80 transition-colors text-left"
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="font-medium">{action.title}</div>
              <div className="text-sm text-gray-400">{action.description}</div>
            </button>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="bg-grass-bg-light rounded-xl p-4 mb-8">
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <Image
                      src="/GrassAppLogo.png"
                      alt="AI Assistant"
                      width={32}
                      height={32}
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-grass-primary text-white'
                      : 'bg-black text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image
                    src="/GrassAppLogo.png"
                    alt="AI Assistant"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="bg-black text-white rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-black rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-grass-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grass-primary-light transition-colors"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.question} className="bg-grass-bg-light rounded-xl p-4">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 