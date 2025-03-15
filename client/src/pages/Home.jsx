//import HeaderDisplay from "@/components/custom/HeaderDisplay";
//import HeaderDisplay from "../components/custom/HeaderDisplay";

import ProductList from "../components/custom/ProductList";
import FilterMenu from "../components/custom/FilterMenu";
import HeaderDisplay from "../components/custom/HeaderDisplay";

//import React from "react";

const Home = () => {
  return (
    <div>
      <HeaderDisplay />
      <FilterMenu />
      <ProductList />
    </div>
  );
};

export default Home;
