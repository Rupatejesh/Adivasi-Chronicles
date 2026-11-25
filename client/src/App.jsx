import './App.css';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import CinematicIntro from './components/intro/CinematicIntro.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import VoiceGuide from './components/voice/VoiceGuide.jsx';
import About from './pages/About.jsx';
import Admin from './pages/Admin.jsx';
import Blog from './pages/Blog.jsx';
import BlogDetail from './pages/BlogDetail.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Books from './pages/Books.jsx';
import Constitution from './pages/Constitution.jsx';
import ConstitutionDetail from './pages/ConstitutionDetail.jsx';
import Contact from './pages/Contact.jsx';
import Gallery from './pages/Gallery.jsx';
import Heroes from './pages/Heroes.jsx';
import HeroDetail from './pages/HeroDetail.jsx';
import Home from './pages/Home.jsx';
import ITDA from './pages/ITDA.jsx';
import Login from './pages/Login.jsx';
import Music from './pages/Music.jsx';
import MyJourney from './pages/MyJourney.jsx';
import NotFound from './pages/NotFound.jsx';
import Register from './pages/Register.jsx';
import Rights from './pages/Rights.jsx';
import RightDetail from './pages/RightDetail.jsx';
import Schemes from './pages/Schemes.jsx';
import Search from './pages/Search.jsx';
import TribalHistory from './pages/TribalHistory.jsx';

function App() {
  const [isIntroActive, setIsIntroActive] = useState(true);

  return (
    <>
      <VoiceGuide entrance={isIntroActive} />
      {isIntroActive ? <CinematicIntro onContinue={() => setIsIntroActive(false)} /> : (
        <div className="app-shell">
          <Navbar />
          <ScrollToTop />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/tribal-history" element={<TribalHistory />} />
              <Route path="/heroes" element={<Heroes />} />
              <Route path="/heroes/:slug" element={<HeroDetail />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:slug" element={<BookDetail />} />
              <Route path="/constitution" element={<Constitution />} />
              <Route path="/constitution/:slug" element={<ConstitutionDetail />} />
              <Route path="/rights" element={<Rights />} />
              <Route path="/rights/:slug" element={<RightDetail />} />
              <Route path="/itda" element={<ITDA />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/search" element={<Search />} />
              <Route path="/music" element={<Music />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/my-journey" element={<MyJourney />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
