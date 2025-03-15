//import React from 'react'

import Footer from "../components/custom/Footer";
import Navbar from "../components/custom/Navbar";

export const RootLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};
