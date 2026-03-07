import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface VaccinationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const VaccinationReportModal: React.FC<VaccinationReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    testLevel: '',
    status: 'positive'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ code: '', name: '', testLevel: '', status: 'positive' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Vaccination Report</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Enter Your Code"
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter Name"
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Test level
              </label>
              <input
                type="text"
                name="testLevel"
                value={formData.testLevel}
                onChange={handleInputChange}
                placeholder="Enter Test Level"
                className="input"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Status
              </label>
              <div className="flex items-center space-x-6 mt-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="positive"
                    checked={formData.status === 'positive'}
                    onChange={handleInputChange}
                    className="mr-2 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700">Positive</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="negative"
                    checked={formData.status === 'negative'}
                    onChange={handleInputChange}
                    className="mr-2 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-slate-700">Negative</span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-8 border-t border-slate-200 mt-8">
            <button
              type="submit"
              className="btn btn-success"
            >
              <Save className="h-4 w-4" />
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VaccinationReportModal;