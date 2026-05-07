import React from 'react';
import Navbar from '../components/dashboard/Navbar';
import Header from '../components/dashboard/Header';
import { getSession } from '../actions/auth';

const BlockedScreen = ({ title, message }: { title: string; message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-background text-white">
    <div className="rounded-lg border border-white/10 bg-background p-10 text-center shadow-lg">
      <h1 className="mb-4 text-3xl font-semibold">{title}</h1>
      <p className="text-base text-white/80">{message}</p>
    </div>
  </div>
);

const LayoutWrapper = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    return <BlockedScreen title="Unauthorized" message="Please log in to continue." />;
  }

  if (session.role !== 'Admin') {
    return <BlockedScreen title="Access Denied" message="This area is restricted to administrators." />;
  }

  return (
   
    <div className="flex h-screen w-full bg-primary text-white overflow-hidden">
      
      
      <div className="w-64 flex-shrink-0 border-r border-white/5">
        <Navbar />
      </div>

     
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        
       
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default LayoutWrapper;