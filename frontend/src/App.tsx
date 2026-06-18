import React from 'react';
import ProductGrid from './components/ProductGrid';
import './styles/theme.css';
import './styles/animations.css';

const App: React.FC = () => {
  return (
    <div className="app" role="application" aria-label="My Chemical Romance Store">
      <header className="app-header" role="banner">
        <div className="app-header-content">
          <h1 className="app-title">The Black Parade Emporium</h1>
          <p className="app-subtitle">Vintage Records & Dark Curiosities</p>
        </div>
        <nav className="app-nav" role="navigation" aria-label="Main navigation">
          <ul className="app-nav-list">
            <li>
              <a href="/" className="app-nav-link active" aria-current="page">
                Collection
              </a>
            </li>
            <li>
              <a href="/cart" className="app-nav-link">
                Cart
              </a>
            </li>
            <li>
              <a href="/checkout" className="app-nav-link">
                Checkout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="app-main" role="main">
        <section className="app-hero" aria-label="Welcome">
          <div className="app-hero-content">
            <h2 className="app-hero-heading">Welcome to the Dark Side</h2>
            <p className="app-hero-text">
              Browse our collection of rare vinyl, apparel, and artifacts.
              Each piece carries the echo of something forgotten.
            </p>
          </div>
        </section>
        <section className="app-products" aria-label="Product collection">
          <ProductGrid />
        </section>
      </main>
      <footer className="app-footer" role="contentinfo">
        <div className="app-footer-content">
          <p className="app-footer-text">
            &copy; {new Date().getFullYear()} The Black Parade Emporium. All rights reserved.
          </p>
          <p className="app-footer-tagline">
            When I grow up, I want to be a forgotten record in a dusty shop.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;