import React from 'react';
import Header from '../components/Header/Header';
import SpecialityMenu from '../components/SpecialityMenu';
import TopDoctors from '../components/TopDoctors';
import Banner from '../components/Banner';
import Flowchart from '../components/flowchart/Flowchart';


const Home = () => {
  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
      <Flowchart />
    </div>
  );
};

export default Home;
