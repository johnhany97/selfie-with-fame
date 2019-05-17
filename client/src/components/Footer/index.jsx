import React from 'react';
import './index.css';

/**
 * @Params
 * none
 * 
 * @summary
 * Displays footer at the bottom of the page with page links and address
 * information
 * 
 * @returns
 * Returns JSX for footer
 */
const Footer = () => (
  <footer>
    <div className="container-lg">
        <div className="footer-row">
          <div className="footer-item">
            <h4 className="footer-item-title">Pages</h4>
            <hr />
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>Discover</li>
              <li>Events</li>
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="footer-item">
            <h4 className="footer-item-title">Contact</h4>
            <hr />
            <ul>
              <li>Tel: 01234567891</li>
              <li>Address: 113 Cobden View</li>
              <li>Events</li>
              <li>About</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div className="footer-item">
            <h4 className="footer-item-title">Social</h4>
            <hr />
            <ul>
              <li>Facebook</li>
              <li>Instagram</li>
              <li>Twitter</li>
            </ul>
          </div>
        </div>
    </div>
  </footer>
);

export default Footer;
