import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      question: "How do I report a new medical case?",
      answer: "Navigate to the 'Notification' menu in the sidebar and select the appropriate disease category (e.g., Malaria, TB, Viral Hepatitis). From there, click on the corresponding 'New Entry' or 'Notification' option to fill out the reporting form."
    },
    {
      question: "Can I edit a submitted notification?",
      answer: "Yes, you can edit a submitted notification if you have the appropriate permissions. Go to the relevant listing page (e.g., 'Malaria Listing'), find the record you wish to modify, and click the edit icon in the actions column."
    },
    {
      question: "How do I generate a vaccination report?",
      answer: "Go to 'Reporting' > 'Vaccination Report' in the sidebar. Select your desired date range, region, and other filters, then click the 'Generate' button. You can also export the report to PDF or Excel."
    },
    {
      question: "What should I do if I forget my password?",
      answer: "Please contact your system administrator to reset your password. If you are an administrator, use the 'Forgot Password' link on the login screen to receive a reset link via email."
    },
    {
      question: "Are the statistics on the dashboard real-time?",
      answer: "Yes, the dashboard statistics are updated in real-time as new notifications and cases are entered into the system across all medical facilities."
    },
    {
      question: "How do I manage user roles and permissions?",
      answer: "Users with Super Admin privileges can navigate to 'User Management' from the sidebar. Here, you can create new users, assign roles (like Admin, Doctor, or Viewer), and manage their access rights."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <HelpCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Find answers to common questions about using the AccuHealth Medical Suite.
        </p>
        
        {/* Search Box */}
        <div className="max-w-xl mx-auto relative mt-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mt-8">
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  activeIndex === index 
                    ? 'border-blue-200 bg-blue-50/30' 
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <button
                  className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                >
                  <span className={`font-semibold text-lg transition-colors ${activeIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} 
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeIndex === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900">No results found</h3>
              <p className="text-slate-500">We couldn't find any FAQs matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-left mb-6 md:mb-0">
            <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
            <p className="text-blue-100 max-w-md">
              If you couldn't find the answer to your question, our support team is ready to assist you.
            </p>
          </div>
          <Link 
            to="/contact" 
            className="px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center space-x-2"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
