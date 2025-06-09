import React from 'react';
import MainBoard from './MainBoard';
import Footer from './Footer';
import HeaderMenu from './HeaderMenu';



const StudentsPage: React.FC = () => {
  return (
    <>
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
    <main className='flex-1'>
      <HeaderMenu />
      <MainBoard />
      </main>
      <Footer />
      </div>
    </>
  );
};

export default StudentsPage;
