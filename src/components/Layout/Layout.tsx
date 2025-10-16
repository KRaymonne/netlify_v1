import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function Layout() {
  const [country, setCountry] = useState('cameroun');

  const handleCountryChange = (newCountry: string) => {
    console.log(`Changement de pays: ${newCountry}`);
    setCountry(newCountry);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar country={country} />
      <div className="flex-1 flex flex-col">
        <Header onCountryChange={handleCountryChange} />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}