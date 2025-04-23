import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { BsTelephone } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div className="py-5">
      <div className="text-center mb-4">
        <h2 className={styles.header}>Get in Touch</h2>
        <p className="text-muted fw-bold">We'd love to hear from you. Please fill out this form or reach out via social media.</p>
      </div>

      <div className="row d-flex justify-content-evenly">
        <div className={`col-10 col-md-4 p-4 mb-4 ${styles.contactContainer}`}>
          <form>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.formLabel}>First Name</label>
              <input
                type="text"
                id="firstName"
                className={styles.formInput}
                placeholder="Enter your first name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.formLabel}>Last Name</label>
              <input
                type="text"
                id="lastName"
                className={styles.formInput}
                placeholder="Enter your last name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>Email Address</label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>Message</label>
              <textarea
                id="message"
                className={styles.formInput}
                rows="4"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Send Message
            </button>
          </form>
        </div>

        <div className={`col-10 col-md-4 p-4 mb-4 ${styles.contactContainer}`}>
          <h4 className="mb-4">Contact Information</h4>
          
          <div className={styles.infoItem}>
            <HiLocationMarker className={styles.icon} />
            <span>123 New Cairo, Egypt</span>
          </div>

          <div className={styles.infoItem}>
            <BsTelephone className={styles.icon} />
            <a 
              href="tel:+20555123456" 
              className={styles.phoneLink}
            >
              +20 (555) 123-4567
            </a>
          </div>

          <div className={`${styles.infoItem} mb-5`}>
            <MdEmail className={styles.icon} />
            <a 
              href="mailto:scholarx.gmail@eg.com" 
              className={styles.emailLink}
            >
              scholarx.gmail@eg.com
            </a>
          </div>

          <div className="mb-5">
            <h5 className="mb-3 fw-bolder">Follow Us</h5>
            <div className={styles.socialLinks}>
              <a href="https://www.facebook.com/@ScholarX.eg" target="_blank"  className={styles.socialLink}><FaFacebook size={20} /></a>
              <a href="https://twitter.com/scholarx" target="_blank"  className={styles.socialLink}><FaTwitter size={20} /></a>
              <a href="https://www.instagram.com/scholarx.eg" target="_blank"  className={styles.socialLink}><FaInstagram size={20} /></a>
              <a href="https://www.linkedin.com/company/bosla0" target="_blank"className={styles.socialLink}><FaLinkedin size={20} /></a>
            </div>
          </div>

          <div className={styles.newsletterSection}>
            <h5 className="mt-3 fw-bold">Subscribe to Newsletter</h5>
            <p className="text-muted fw-bold">Stay updated with our latest news and updates.</p>

            <div className={styles.newsletterForm}>
              <input
                type="email"
                id="newsletter"
                className={styles.formInput}
                placeholder="Enter your email"
              />
              <button className={styles.newsletterBtn}>
                <MdEmail size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

