'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: 'أهلاً! كيف أقدر أساعدك؟المحادثه مخصصه للخدمات اي سؤال خارجي سيتم الرد عشوائي' },
  ]);
  const [input, setInput] = useState('');
  const [today, settoday] = useState(()=> localStorage.getItem("lastResetDate"));
  const [requestCount, setRequestCount] = useState(() => {
    const savedCount = localStorage.getItem('requestCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // دالة لتمرير السكّول تلقائيًا لآخر رسالة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // تحديث عدد الطلبات عند إضافة رسالة جديدة    بشكل مؤقت
  useEffect(() => {
    // console.log("today saved" , today , "today naw", new Date().toDateString() )
    if (today !== new Date().toDateString()) {
      localStorage.setItem("lastResetDate", new Date().toDateString());
      setRequestCount(0);
    }
    settoday(new Date().toDateString())
    
    localStorage.setItem('requestCount', requestCount.toString());

  }, [requestCount]);
  // إرسال الرسالة إلى API
  const sendMessage = async () => {
    if (!input.trim()) return;
    // تحديث عدد الطلبات
    if (requestCount >= 5) {
        setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: 'لقد وصلت إلى الحد الأقصى للطلبات اليوم😔. يرجى العودة غداً. او استخدم الفلتر واختار الفئة اللي بتدور عليها😊' }]);
      setRequestCount(prev => prev + 1);

        return;
      }

    const userMsg = { id: Date.now(), from: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // استدعاء API الخاص بك
    try {
      const res = await fetch('/api/POST_Routes/chatRouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });
      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        text: data.message.answer || 'معنديش رد دلوقتي.',
      };
    
      setMessages(prev => [...prev, botMsg]);
      if (data.message.answer){
        setRequestCount(prev => prev + 1);
      }
    //   setRequestCount(prev => prev + 1);
      scrollToBottom();
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, from: 'bot', text: 'حصل خطأ في الاتصال.' },
      ]);
    }
  };

  // إرسال الرسالة عند الضغط على Enter
interface Message {
    id: number;
    from: 'user' | 'bot';
    text: string;
}

const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
         if (requestCount <= 6) {
            console.log("requestCount" + requestCount)
        sendMessage();
         }
    }
};

  return (
    <div className='p-6 w-full h-full'>
    <div className="flex flex-col max-w-xl mx-auto sm:h-[80vh] h-[100%] border rounded shadow-lg overflow-hidden  ">
        <div className='z-50 h-[30%]'>
          <img
            src="https://cdn.freework.ai/icon/myneoai.app.png"
            alt="MyNeo AI Tool Review: Top Alternatives, Pricing, Features and Benefits"
            className="nofocus h-[80%] w-full object-cover rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300"
            
        
            
          />
        </div>
      {/* الرسائل */}
      <div className="flex-1 p-0 overflow-y-auto bg-gray-50" dir='rtl'>
        <AnimatePresence>
          {messages.map(({ id, from, text }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-3 max-w-[100%] p-3 rounded-l-lg whitespace-pre-line ${
                from === 'user'
                  ? 'bg-blue-500 text-white self-end '
                  : 'bg-gray-300 text-[#000000] self-start font-semibold'
              }`}
            >
              {text}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* شريط الإدخال */}
      <div className="flex flex-wrap p-3 border-t bg-white">
        <input
          type="text"
          placeholder="اكتب رسالتك هنا..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          disabled={requestCount >= 6}
          onClick={sendMessage}
          className="ml-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
            <svg className="w-[20px] h-[20px]"  xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" role="img" aria-labelledby="sendIconTitle" stroke="#ffffff" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" fill="none" color="#ffffff"> <title id="sendIconTitle">ارسال</title> <polygon points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394"/> </svg>
        </button>
        <div className="ml-4 pt-3 text-[#ff0000] text-[12px] font-semibold"> رصيدك اليوم: { requestCount > 4 ?  0 :  5 - requestCount}</div>
      </div>
    </div>
    </div>
  );
}
