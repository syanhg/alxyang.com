/* Carousel styles */
.carousel {
    position: relative;
    width: 100%;
    max-width: 700px;
    margin: 40px 0;
    overflow: hidden;
}

.carousel::before,
.carousel::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 150px;
    z-index: 2;
    pointer-events: none;
}

.carousel::before {
    left: 0;
    background: linear-gradient(to right, #f5f5f5 0%, #f5f5f5 20%, transparent 100%);
}

.carousel::after {
    right: 0;
    background: linear-gradient(to left, #f5f5f5 0%, #f5f5f5 20%, transparent 100%);
} black 10%, black 90%, transparent);
}

.carousel-track {
    display: flex;
    gap: 15px;
    animation: scroll 30s linear infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.carousel-track {
    animation: scroll 30s linear infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}

.carousel-track {
    display: flex;
    gap: 15px;
    animation: scroll 30s linear infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
}/* Carousel styles */
.carousel {
    position: relative;
    width: 100%;
    max-width: 700px;
    margin: 40px 0;
}

.carousel-track {
    display: flex;
    gap: 15px;
    overflow-x: auto;
    scroll-behavior: smooth;
    padding: 10px 0;
    scrollbar-width: none;
}

.carousel-track::-webkit-scrollbar {
    display: none;
}

.carousel-track img {
    flex: 0 0 auto;
    width: 300px;
    height: 200px;
    object-fit: cover;
    cursor: pointer;
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.carousel-track img:hover {
    transform: scale(1.05);
    opacity: 0.8;
}

/* Lightbox styles */
.lightbox {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
}

.lightbox.active {
    display: flex;
}

#liquidGlassContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
}

#lightboxImg {
    position: relative;
    z-index: 2;
    max-width: 90%;
    max-height: 90vh;
    object-fit: contain;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
}

.close-btn {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 3;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 36px;
    cursor: pointer;
    color: #666;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    transition: background 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 1);
}

/* Mobile responsive */
@media (max-width: 768px) {
    .carousel-track img {
        width: 250px;
        height: 170px;
    }
    
    .carousel-btn {
        width: 35px;
        height: 35px;
        font-size: 20px;
    }
}
