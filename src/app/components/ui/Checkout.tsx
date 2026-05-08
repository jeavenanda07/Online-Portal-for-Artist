'use client';

import Modal from './Modal';
import { IoArrowBack } from "react-icons/io5";
import { useState } from 'react';

interface ArtObject {
  artwork_id: string;
  artwork_title: string;
  art_file: string;
  price: number;
  stocks: number;
  status: string;
  user_profile: {
    full_name: string;
    username: string;
  };
}

interface CheckOutProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  art: ArtObject; 
}


const Checkout = ({ isOpen, onClose, className, art }: CheckOutProps) => {
  if (!art) return null;
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/create-gcash-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 10000, // ₱100
        }),
      });

      const data = await res.json();

      console.log("FRONTEND RESPONSE:", data);

      if (!res.ok) {
        alert("Payment failed");
        return;
      }

      const checkoutUrl =
        data?.data?.attributes?.redirect?.checkout_url;

      if (!checkoutUrl) {
        alert("Failed to initiate payment.");
        return;
      }

      // ✅ Redirect to GCash
      window.location.href = checkoutUrl;

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[800px]   w-full flex flex-col">
      <button onClick={onClose} className='flex gap-2 items-center'>
        <IoArrowBack />
        <p>Back</p>
      </button>

      <div className="grid grid-cols-2 bg-white h-[520px] w-[50em] mx-auto gap-5 mt-6 mb-10 text-base text-black">
        <div className="py-6 px-20 gap-10 mt-8">
          <p className="text-center">Choose Payment Method</p>
          <div className="mt-6 flex flex-col items-center">
            <img className="h-7 w-7" src="https://images.seeklogo.com/logo-png/52/1/gcash-logo-png_seeklogo-522261.png" alt="GCash Logo"/>
            <p className="font-bold mt-2">GCash</p>
            <p className="text-sm mt-25 text-center">You’ll be redirected to GCash to complete this payment.</p>
          </div>
        </div>

        <div className="bg-[#F2F2F2] p-6">
          <h2>Summary</h2>
          <hr className="mt-4 opacity-50" />
          <div className="flex justify-between mt-4 text-sm">
            {/* DYNAMIC DATA HERE */}
            <p>{art.artwork_title} <span className="font-bold">by {art.user_profile.full_name}</span></p>
            <p className="font-bold">₱{art.price}</p>
          </div>
          <div>
            <img 
              className="mt-6 w-full h-40 object-cover rounded-lg" 
              src={art.art_file} 
              alt={art.artwork_title} 
            />
          </div>
          <p className="mt-2 text-xs opacity-70">1 downloadable</p>
          
          <hr className="mt-4 opacity-50" />
          <div className="flex justify-between mt-2 text-sm font-bold">
            <p>Total</p>
            <p>₱{art.price}</p>
          </div>
          <button
        onClick={async () => {
          try {
            const res = await fetch("/api/create-gcash-payment", {
              method: "POST",
            });

            const data = await res.json();
            const checkoutUrl = data?.data?.attributes?.checkout_url;

            if (checkoutUrl) {
              window.location.href = checkoutUrl;
            } else {
              alert("Failed to redirect.");
            }
          } catch (err) {
            console.error(err);
            alert("Something went wrong.");
          }
        }}
        className="rounded-md bg-green-500 hover:bg-green-600 text-white w-full mt-3 cursor-pointer p-2 font-bold transition-all active:scale-95"
      >
        Pay with Gcash
      </button>
        </div>
      </div>
    </Modal>
  );
};

export default Checkout
