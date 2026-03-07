import React, { useState } from 'react';
import { ArrowLeft, User, FileText, Activity, TestTube, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { HEVNotificationFormData } from '../../types/index';
import { API_BASE_URL } from '../../config';

const HEVEntry: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<HEVNotificationFormData>({
        governorate: 'NORTH ASH SHARQIYAH',
        wilayat: 'Ibra',
        institution: '',
        reportingDate: new Date().toISOString().split('T')[0],
        patientId: '',
        civilId: '',
        expiryDate: '',
        dob: '',
        age: '',
        term: 'Years',
        passportNo: '',
        nationality: '',
        firstName: '',
        secondName: '',
        thirdName: '',
        fourthName: '',
        gender: '',
        tribe: '',
        sheikhName: '',
        mobileNo: '',
        nextOfKinMobile: '',
        patientGovernorate: '',
        patientWilayat: '',
        village: '',
        subLocality: '',
        symptoms: [
            { name: 'Fever', value: '', duration: '' },
            { name: 'Jaundice', value: '', duration: '' },
            { name: 'Nausea / Vomiting', value: '', duration: '' },
            { name: 'Anorexia', value: '', duration: '' },
            { name: 'Abdominal Pain (RUQ)', value: '', duration: '' },
            { name: 'Pruritus', value: '', duration: '' },
            { name: 'Pale Stools', value: '', duration: '' },
            { name: 'Arthralgia / Myalgia', value: '', duration: '' },
            { name: 'Diarrhea', value: '', duration: '' },
            { name: 'Fatigue / Malaise', value: '', duration: '' }
        ],
        hevIgM: '',
        hevIgG: '',
        hevPcr: '',
        hevPcrValue: '',
        alt: '',
        ast: '',
        outcome: '',
        remarks: '',
        onsetOfSymptomsDate: ''
    });

    const steps = [
        { id: 'patient-info', title: 'Patient Info', icon: User, description: 'Patient Information & Basic Details' },
        { id: 'clinical-details', title: 'Clinical Details', icon: Activity, description: 'Symptoms' },
        { id: 'lab-investigation', title: 'Lab Investigation', icon: TestTube, description: 'HEV Testing' },
        { id: 'classification-outcome', title: 'Classification & Outcome', icon: FileText, description: 'Liver Function Tests & Outcome' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSymptomChange = (index: number, field: 'value' | 'duration', val: string) => {
        const newSymptoms = [...formData.symptoms];
        newSymptoms[index] = { ...newSymptoms[index], [field]: val };
        setFormData(prev => ({ ...prev, symptoms: newSymptoms }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/hev-notifications`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Success
                navigate('/hev-notification');
            } else {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                alert(`Error saving notification: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Network error saving notification');
        } finally {
            setLoading(false);
        }
    };

    const renderPatientInfo = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">HEV Notification</h2>
                <p className="text-yellow-600">[Patient Information & Basic Details]</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">State <span className="text-red-500">*</span></label>
                    <input type="text" name="governorate" value={formData.governorate} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Sub-Locality</label>
                    <input type="text" className="w-full px-4 py-3 border border-slate-300 rounded-lg" name="subLocality" value={formData.subLocality} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Locality <span className="text-red-500">*</span></label>
                    <input type="text" name="wilayat" value={formData.wilayat} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Reporting Date <span className="text-red-500">*</span></label>
                    <input type="date" name="reportingDate" value={formData.reportingDate} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                </div>
                 <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Patient ID <span className="text-red-500">*</span></label>
                    <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" required />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-6">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h5 className="text-lg font-semibold text-slate-900">Patient Information</h5>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">National ID</label>
                        <input type="text" name="civilId" value={formData.civilId} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Second Name</label>
                        <input type="text" name="secondName" value={formData.secondName} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Third Name</label>
                        <input type="text" name="thirdName" value={formData.thirdName} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Fourth Name</label>
                        <input type="text" name="fourthName" value={formData.fourthName} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" />
                    </div>
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Nationality</label>
                        <select name="nationality" value={formData.nationality} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                            <option value="">Select</option>
                            <option value="Omani">Omani</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700">Gender</label>
                        <div className="flex gap-4 mt-2">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} />
                                <span>Male</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} />
                                <span>Female</span>
                            </label>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Age</label>
                        <div className="flex gap-2">
                             <select name="term" value={formData.term} onChange={handleInputChange} className="w-1/3 px-2 py-3 border border-slate-300 rounded-lg">
                                <option value="Years">Years</option>
                                <option value="Months">Months</option>
                                <option value="Days">Days</option>
                            </select>
                            <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="flex-1 px-4 py-3 border border-slate-300 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderClinicalDetails = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Clinical Details</h2>
                <p className="text-slate-600">Select "Yes" or "No" for each symptom and specify duration.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 grid grid-cols-12 gap-4">
                    <div className="col-span-4 font-semibold">Symptoms</div>
                    <div className="col-span-4 font-semibold text-center">Yes / No</div>
                    <div className="col-span-4 font-semibold">Duration (Days)</div>
                </div>
                <div className="p-6 space-y-4">
                    {formData.symptoms.map((symptom, index) => (
                        <div key={index} className="grid grid-cols-12 gap-4 items-center border-b border-slate-100 pb-2 last:border-0">
                            <div className="col-span-4 font-medium">{symptom.name}</div>
                            <div className="col-span-4 flex justify-center space-x-4">
                                <label className="flex items-center space-x-1">
                                    <input type="radio" name={`symptom-${index}`} checked={symptom.value === 'Yes'} onChange={() => handleSymptomChange(index, 'value', 'Yes')} />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center space-x-1">
                                    <input type="radio" name={`symptom-${index}`} checked={symptom.value === 'No'} onChange={() => handleSymptomChange(index, 'value', 'No')} />
                                    <span>No</span>
                                </label>
                            </div>
                            <div className="col-span-4">
                                <input type="text" placeholder="Duration" value={symptom.duration} onChange={(e) => handleSymptomChange(index, 'duration', e.target.value)} disabled={symptom.value !== 'Yes'} className="w-full px-3 py-2 border border-slate-300 rounded-lg disabled:bg-slate-100 placeholder:text-slate-300" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderLabInvestigation = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Lab Investigation</h2>
                <p className="text-yellow-600">HEV Testing</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h5 className="font-semibold text-lg border-b pb-2">HEV IgM</h5>
                    <div className="flex gap-4">
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="hevIgM" value="Positive" checked={formData.hevIgM === 'Positive'} onChange={handleInputChange} />
                            <span>Positive</span>
                        </label>
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="hevIgM" value="Negative" checked={formData.hevIgM === 'Negative'} onChange={handleInputChange} />
                            <span>Negative</span>
                        </label>
                    </div>
                </div>
                <div className="space-y-4">
                    <h5 className="font-semibold text-lg border-b pb-2">HEV RNA PCR</h5>
                    <div className="flex gap-4 items-center">
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="hevPcr" value="Positive" checked={formData.hevPcr === 'Positive'} onChange={handleInputChange} />
                            <span>Positive</span>
                        </label>
                        <label className="flex items-center space-x-2">
                             <input type="radio" name="hevPcr" value="Negative" checked={formData.hevPcr === 'Negative'} onChange={handleInputChange} />
                            <span>Negative</span>
                        </label>
                    </div>
                     {formData.hevPcr === 'Positive' && (
                        <div className="mt-2">
                            <input type="text" name="hevPcrValue" placeholder="PCR Value" value={formData.hevPcrValue} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

     const renderOutcome = () => (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Classification & Outcome</h2>
                <p className="text-slate-600">Liver Function Tests and Final Outcome</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                <div>
                    <h5 className="font-semibold text-lg text-slate-800 mb-4 border-b pb-2">Liver Function Tests</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">ALT (U/L)</label>
                            <div className="relative">
                                <input type="text" name="alt" value={formData.alt} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg pr-12" placeholder="Enter value" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">U/L</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700">AST (U/L)</label>
                            <div className="relative">
                                <input type="text" name="ast" value={formData.ast} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg pr-12" placeholder="Enter value" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">U/L</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Outcome</label>
                    <select name="outcome" value={formData.outcome} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg">
                        <option value="">Select</option>
                        <option value="Recovered">Recovered</option>
                        <option value="Died">Died</option>
                        <option value="Referred">Referred</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Remarks</label>
                    <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full px-4 py-3 border border-slate-300 rounded-lg" rows={3}></textarea>
                </div>
            </div>
        </div>
    );

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0: return renderPatientInfo();
            case 1: return renderClinicalDetails();
            case 2: return renderLabInvestigation();
            case 3: return renderOutcome();
            default: return renderPatientInfo();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
             <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 px-6 py-4">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/hev-notification')} className="p-2 hover:bg-slate-100 rounded-lg">
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">HEV Notification Entry</h1>
                </div>
            </div>

            <div className="p-6">
                 {/* Progress Steps */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold">Step {currentStep + 1} of {steps.length}</h2>
                    </div>
                     <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-4">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;
                            return (
                                <React.Fragment key={step.id}>
                                    <div
                                        onClick={() => setCurrentStep(index)}
                                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' : isCompleted ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium text-sm hidden sm:block">{step.title}</span>
                                    </div>
                                    {index < steps.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-8">
                    {renderCurrentStep()}
                    <div className="flex justify-between pt-8 border-t border-slate-200 mt-8">
                        <button onClick={handlePrevious} disabled={currentStep === 0} className="flex items-center space-x-2 px-6 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50">
                            <ChevronLeft className="h-4 w-4" />
                            <span>Previous</span>
                        </button>
                        {currentStep === steps.length - 1 ? (
                            <button onClick={handleSubmit} disabled={loading} className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50">
                                {loading ? <span>Saving...</span> : <> <Save className="h-4 w-4" /> <span>Save</span> </>}
                            </button>
                        ) : (
                            <button onClick={handleNext} className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                <span>Next</span>
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HEVEntry;
