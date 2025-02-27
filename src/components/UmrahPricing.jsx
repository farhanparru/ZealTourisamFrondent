// eslint-disable-next-line no-unused-vars

import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    right: 'auto',
    // bottom: 'auto',
    width: '90%',
    height: "90%",
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '9px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
};


// eslint-disable-next-line react/prop-types
const UmrahPricingModal = ({ isOpen, onClose, onSubmit, umrahData }) => {
  const [pricingData, setPricingData] = useState({

    adultNo: umrahData.pricing?.adultNo || '',
    childNo: umrahData.pricing?.childNo || '',
    infantNo: umrahData.pricing?.infantNo || '',

    packageCost: umrahData.pricing?.packageCost || [{
      title: '',
      amount: '',
      currency: '',
    }],

    tax: umrahData.pricing?.tax || [{
      title: '',
      amount: '',
      currency: '',
    }],
    totalAmount: umrahData.pricing?.totalAmount || '',
  });

    // Calculate total amount
    const calculateTotal = () => {
      const packageCostTotal = pricingData.packageCost.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
      );
      const taxTotal = pricingData.tax.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
      );
      return packageCostTotal + taxTotal;
    };
  
    // Update total amount whenever packageCost or tax changes
    useEffect(() => {
      const total = calculateTotal();
      setPricingData((prevData) => ({ ...prevData, totalAmount: total.toFixed(2) }));
    }, [pricingData.packageCost, pricingData.tax]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setPricingData({ ...pricingData, [name]: value });
  };

  // Handle change for array fields (packageCost and tax)
  const handleArrayChange = (index, field, value, arrayType) => {
    const updatedArray = pricingData[arrayType].map((item, idx) =>
      idx === index ? { ...item, [field]: value } : item
    );
    setPricingData({ ...pricingData, [arrayType]: updatedArray });
  };

  // Add new item to packageCost or tax
  const handleAddItem = (arrayType) => {
    const newItem = { title: '', amount: '', currency: '' };
    setPricingData({ ...pricingData, [arrayType]: [...pricingData[arrayType], newItem] });
  };

  // Remove item from packageCost or tax
  const handleRemoveItem = (index, arrayType) => {
    const updatedArray = pricingData[arrayType].filter((_, idx) => idx !== index);
    setPricingData({ ...pricingData, [arrayType]: updatedArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(pricingData); // Pass data to parent component
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Pricing Modal" style={customStyles}>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Pricing Details</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="adultNo">
            Adult Number
          </label>
          <input
            type="number"
            name="adultNo"
            value={pricingData.adultNo}
            onChange={handleChange}
            placeholder="Adult No."
            className="form-input w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="childNo">
            Child Number
          </label>
          <input
            name="childNo"
            type="number"
            value={pricingData.childNo}
            onChange={handleChange}
            placeholder="Child No"
            className="form-input w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="infantNo">
          Infant Number
          </label>
          <input
            name="infantNo"
            type="number"
            value={pricingData.infantNo}
            onChange={handleChange}
            placeholder="Infant No"
            className="form-input w-full mb-4 p-2 border border-gray-300 rounded"
          />

          <h3 className="text-xl font-semibold mb-2">Package Cost</h3>
          {pricingData.packageCost.map((cost, index) => (
            <div key={index} className="form-array-item mb-4">
              <input
                type="text"
                placeholder="Package Title"
                value={cost.title}
                onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'packageCost')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Amount"
                value={cost.amount}
                onChange={(e) => handleArrayChange(index, 'amount', e.target.value, 'packageCost')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Currency"
                value={cost.currency}
                onChange={(e) => handleArrayChange(index, 'currency', e.target.value, 'packageCost')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <button type="button" onClick={() => handleRemoveItem(index, 'packageCost')} className="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('packageCost')} className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Add Cost
          </button>

          <h3 className="text-xl font-semibold mb-2">Tax</h3>
          {pricingData.tax.map((taxItem, index) => (
            <div key={index} className="form-array-item mb-4">
              <input
                type="text"
                placeholder="Tax Title"
                value={taxItem.title}
                onChange={(e) => handleArrayChange(index, 'title', e.target.value, 'tax')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Amount"
                value={taxItem.amount}
                onChange={(e) => handleArrayChange(index, 'amount', e.target.value, 'tax')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Currency"
                value={taxItem.currency}
                onChange={(e) => handleArrayChange(index, 'currency', e.target.value, 'tax')}
                className="form-input w-full mb-2 p-2 border border-gray-300 rounded"
              />
              <button type="button" onClick={() => handleRemoveItem(index, 'tax')} className="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddItem('tax')} className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Add Tax
          </button>

          <h3 className="text-xl font-semibold mb-2">Total Amount</h3>
          <input
            type="text"
            name="totalAmount"
            disabled
            value={pricingData.totalAmount}
            onChange={handleChange}
            placeholder="Total Amount"
            className="form-input w-full mb-4 p-2 border border-gray-300 rounded"
          />

          <div className="mt-3 flex justify-end space-x-2">
            <button type="submit" className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Save Pricing
            </button>
            <button type="button" onClick={onClose} className="btn bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UmrahPricingModal;