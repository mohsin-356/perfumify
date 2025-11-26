import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

// Simple arrow components
const ChevronLeftIcon = () => (
	<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
	</svg>
);

const ChevronRightIcon = () => (
	<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
	</svg>
);

interface SlideData {
	id: number;
	image: string;
	brand: string;
	slug: string;
}

const HeroSlider: React.FC = () => {
	const router = useRouter();
	const [currentSlide, setCurrentSlide] = useState(0);

	const slides: SlideData[] = [
		{
			id: 1,
			image: "/assets/images/slider/slider_image_1_c@lvinKlien.jpg",
			brand: "CALVIN KLEIN",
			slug: "calvin-klein",
		},
		{
			id: 2,
			image: "/assets/images/slider/slider_image_2_@zz@ro.webp",
			brand: "AZZARO",
			slug: "azzaro",
		},
		{
			id: 3,
			image: "/assets/images/slider/slider_image_3_DDDIIOR.jpg",
			brand: "DIOR",
			slug: "dior",
		},
		{
			id: 4,
			image: "/assets/images/slider/slider_image_4_CH@NEL.jpg",
			brand: "CHANEL",
			slug: "chanel",
		},
		{
			id: 5,
			image: "/assets/images/slider/slider_image_5_CREEEEED.png",
			brand: "CREED",
			slug: "creed",
		},
		{
			id: 6,
			image: "/assets/images/slider/slider_image_6_GRIORGIO@@RMANIII.jpeg",
			brand: "GIORGIO ARMANI",
			slug: "giorgio-armani",
		},
		{
			id: 7,
			image: "/assets/images/slider/slider_image_7_PR@D@.jpg",
			brand: "PRADA",
			slug: "prada",
		},
		{
			id: 8,
			image: "/assets/images/slider/slider_image_8_TOOOM_FFFORD.jpg",
			brand: "TOM FORD",
			slug: "tom-ford",
		},
		{
			id: 9,
			image: "/assets/images/slider/slider_image_9_V@LENTIIINNOO.jpg",
			brand: "VALENTINO",
			slug: "valentino",
		},
	];

	// Auto-slide functionality
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % slides.length);
		}, 5000); // Change slide every 5 seconds

		return () => clearInterval(interval);
	}, [slides.length]);

	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	const goToSlide = (index: number) => {
		setCurrentSlide(index);
	};

	const handleShopNow = (slug: string) => {
		router.push(`/search?brand=${slug}`);
	};

	return (
		<div className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden bg-gray-200">
			{/* Slides */}
			<div
				className="flex transition-transform duration-500 ease-in-out h-full"
				style={{ transform: `translateX(-${currentSlide * 100}%)` }}
			>
				{slides.map((slide) => (
					<div key={slide.id} className="relative w-full h-full flex-shrink-0">
						<Image
							src={slide.image}
							alt={slide.brand}
							fill
							priority={slide.id === 1}
							sizes="100vw"
							quality={70}
							className="w-full h-full object-cover object-center"
						/>

						{/* Shop Now Button - Left Bottom */}
						<div className="absolute bottom-6 left-6">
							<button
								onClick={() => handleShopNow(slide.slug)}
								className="bg-white text-black px-6 py-2 text-sm font-semibold uppercase tracking-wide hover:bg-gray-100 transition-colors duration-300 shadow-lg"
							>
								SHOP NOW
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Navigation Arrows */}
			<button
				onClick={prevSlide}
				className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
				aria-label="Previous slide"
			>
				<ChevronLeftIcon />
			</button>
			
			<button
				onClick={nextSlide}
				className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-300"
				aria-label="Next slide"
			>
				<ChevronRightIcon />
			</button>

			{/* Slide Indicators */}
			<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
				{slides.map((_, index) => (
					<button
						key={index}
						onClick={() => goToSlide(index)}
						className={`w-3 h-3 rounded-full transition-all duration-300 ${
							index === currentSlide
								? "bg-white"
								: "bg-white bg-opacity-50 hover:bg-opacity-75"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};

export default HeroSlider;
