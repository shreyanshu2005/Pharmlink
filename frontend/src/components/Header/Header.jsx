import React, { useState, useEffect } from 'react';
import "./Header.css";

const Header = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const images = [
        'https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img1.svg',
        'https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img2.svg',
        'https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img3.svg',
        'https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img4.svg',
        'https://esanjeevani.mohfw.gov.in/assets/images/slider/slider_img5.svg'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [imageIndex, images.length]);

    return (
        <div>
            <section id='page1'>
                <div id='left-page1'>
                    <h1>Bridging Health and Technology</h1>
                    <p>Facilitates quick and easy access to doctors and medical specialists from your smartphones</p>
                    <div id='pm-card'>
                        <div id='pm-card-top'>
                            <img src='https://esanjeevani.mohfw.gov.in/assets/images/dummy_images/PM_image_136.png' alt="PM's image" />
                            <div>
                                <h2>Shri Narendra Modi</h2>
                                <p><i>Hon’ble Prime Minister of India</i></p>
                            </div>
                        </div>
                        <div id='pm-card-bottom'>
                            <h2><i>"I dream of a Digital India where quality healthcare percolates right up to the remotest regions powered by e-Healthcare."</i></h2>
                        </div>
                    </div>
                </div>
                <div id='right-page1'>
                    <img src={images[imageIndex]} alt={`Image ${imageIndex + 1}`} />
                </div>
            </section>
        </div>
    );
};

export default Header;
