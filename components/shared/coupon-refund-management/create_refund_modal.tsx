
























import React from 'react';
import { X } from 'lucide-react'; 
import CreateRefundForm from './create-refund-form';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRefundModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      onClick={onClose} 
    >
      <div
        className="bg-[#FAF6EF] relative p-6 rounded-md max-h-[90vh] w-[90vw] max-w-5xl overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        {}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={20} />
        </button>

        {}
        <CreateRefundForm />
      </div>
    </div>
  );
};

export default CreateRefundModal;