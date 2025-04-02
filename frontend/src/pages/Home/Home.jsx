import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
// import Footer from '../../components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Features from './components/Features/Features';
import Services from './components/Services/Services';
import Services_2 from './components/Services_2/Services_2';
import Impact from './components/Impact/Impact';
import Contact from './components/Contact/Contact';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <NavBar />

      <main className="main-content">
        <Hero />
        <Features />
        <Services />
        <Services_2 />

        <Impact />

        <Contact />
      </main>


      {/* <Footer /> */}
    </div>
  );
}

export default Home;
