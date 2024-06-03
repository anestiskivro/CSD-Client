import React from 'react';
import { SocialIcon } from 'react-social-icons';
import './footer.css';
const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-icon-container">
            <SocialIcon className='SocialIcon' url="https://www.facebook.com/UniversityOfCrete/?locale=el_GR" target="_blank" rel="noreferrer" />
            <SocialIcon className='SocialIcon' url="https://www.instagram.com/uocrete/" target="_blank" rel="noreferrer" />
            <SocialIcon className='SocialIcon' url = "https://x.com/UOC_gr?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor" target="_blank" rel="noreferrer" />
            </div>
        </footer>
    );
}

export default Footer;