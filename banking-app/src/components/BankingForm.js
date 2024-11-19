import React, { useState } from 'react';
import { PlusCircle, MinusCircle, User } from 'lucide-react';
import axios from 'axios';




const banks = [
  { id: 1, name: 'Chase Bank', logo: '/api/placeholder/200/100' },
  { id: 2, name: 'Bank of America', logo: '/api/placeholder/200/100' },
  { id: 3, name: 'Wells Fargo', logo: '/api/placeholder/200/100' },
  { id: 4, name: 'Citibank', logo: '/api/placeholder/200/100' },
  { id: 5, name: 'Capital One', logo: '/api/placeholder/200/100' },
  { id: 6, name: 'Goldman Sachs', logo: '/api/placeholder/200/100' },
  { id: 7, name: 'Morgan Stanley', logo: '/api/placeholder/200/100' },
  { id: 8, name: 'HSBC', logo: '/api/placeholder/200/100' },
  { id: 9, name: 'TD Bank', logo: '/api/placeholder/200/100' }
];

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const BankingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    annualIncome: ''
  });

  const [familyMembers, setFamilyMembers] = useState([
    { name: '', relationship: '', income: '' }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedBanks, setSelectedBanks] = useState([]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFamilyMemberChange = (index, field, value) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index][field] = value;
    setFamilyMembers(updatedMembers);
  };

  const addFamilyMember = () => {
    setFamilyMembers([...familyMembers, { name: '', relationship: '', income: '' }]);
  };

  const removeFamilyMember = (index) => {
    const updatedMembers = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedMembers);
  };

  const toggleBank = (bankId) => {
    if (selectedBanks.includes(bankId)) {
      setSelectedBanks(selectedBanks.filter(id => id !== bankId));
    } else {
      setSelectedBanks([...selectedBanks, bankId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      familyMembers,
      selectedBanks
    };

    try {
      // Show loading state if you want
      setIsLoading(true); // Add this state if you want loading indication

      const response = await axios.post('http://localhost:5000/api/applications', submissionData);
      
      if (response.status === 201) {
        // Success notification
        alert('Application submitted successfully!');
        
        // Reset form
        setFormData({
          name: '',
          phone: '',
          email: '',
          address: '',
          occupation: '',
          annualIncome: ''
        });
        setFamilyMembers([{ name: '', relationship: '', income: '' }]);
        setSelectedBanks([]);
      }
    } catch (error) {
      // Error handling
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.response) {
        // Server responded with error
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = `Server Error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Could not connect to server. Please check your internet connection.';
      }
      
      alert(errorMessage);
    } finally {
      // Hide loading state if you implemented it
      setIsLoading(false);
    }
};

 

  


  

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details */}
          <Card>
            <div className="flex items-center gap-2 mb-6">
              <User className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-primary-600">Personal Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Family Details */}
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary-600">Family Details</h2>
              <button
                type="button"
                onClick={addFamilyMember}
                className="p-2 text-primary-600 hover:text-primary-800"
              >
                <PlusCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-medium text-gray-700">Member {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeFamilyMember(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <input
                        type="text"
                        value={member.relationship}
                        onChange={(e) => handleFamilyMemberChange(index, 'relationship', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Annual Income</label>
                      <input
                        type="number"
                        value={member.income}
                        onChange={(e) => handleFamilyMemberChange(index, 'income', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bank Selection */}
        <Card className="mt-6">
          <h2 className="text-2xl font-bold text-primary-600 text-center mb-6">
            Select Your Preferred Banks
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleBank(bank.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedBanks.includes(bank.id)}
                  onChange={() => toggleBank(bank.id)}
                  className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <img
                  src={bank.logo}
                  alt={bank.name}
                  className="h-12 w-24 object-contain"
                />
                <span className="font-medium text-gray-700">{bank.name}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="mt-6 text-center">
        <button
  type="submit"
  disabled={isLoading}
  className={`px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg shadow-md 
    ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'} 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
>
  {isLoading ? 'Submitting...' : 'Submit Application'}
</button>
        </div>
      </form>
    </div>
  );
};

export default BankingForm;