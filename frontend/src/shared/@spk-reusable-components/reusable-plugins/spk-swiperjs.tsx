import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, Thumbs, EffectFade, EffectCube, EffectFlip, EffectCoverflow, Mousewheel } from 'swiper/modules';


interface SwiperComponentProps {
  slides: React.ReactNode[]; // Array of slide components or elements
  navigation?: boolean;
  pagination?: boolean | any;
  scrollbar?: boolean | any;
  autoplay?: any;
  loop?: boolean;
  spaceBetween?: number;
  slidesPerView?: number;
  centeredSlides?: boolean;
  mousewheel?: boolean;
  grabCursor?: boolean;
  onSlideChange?: (swiper: any) => void; // Callback for slide change
  onInit?: (swiper: any) => void; // Callback for initialization
  className?: string; // Custom class name for the Swiper
  style?: React.CSSProperties; // Custom styles for the Swiper\
  modules?: any[];
  customModules?: any;
  breakpoint?: any;
  mainClass?: string;
  onswiper?: any;
  keyboard?: boolean | any;
  thumb?: any
  watchslide?: boolean;
  freemode?: boolean;
  effect?: string;
  direction?: string | any;
  cubeEffect?: any
  coverflowEffect?: any
  initialSlide?: number;
}

const SpkSwiperJs: React.FC<SwiperComponentProps> = ({
  slides,
  navigation = false,
  pagination = false,
  scrollbar = false,
  autoplay = false,
  loop = false,
  keyboard = false,
  mousewheel = false,
  spaceBetween,
  breakpoint,
  slidesPerView,
  initialSlide,
  centeredSlides = false,
  grabCursor = true,
  watchslide = false,
  freemode = false,
  onSlideChange,
  onInit,
  className,
  mainClass,
  direction,
  onswiper,
  effect,
  cubeEffect,
  coverflowEffect,
  thumb,
  style,
  customModules = [],
  ...rest
}) => {
  const modules = [Navigation, Pagination, Autoplay, Thumbs, EffectFade, EffectCube, EffectFlip, EffectCoverflow, Mousewheel, ...customModules];
  return (
    <Swiper
      modules={modules}
      navigation={navigation}
      pagination={pagination}
      scrollbar={scrollbar}
      autoplay={autoplay === true ? { delay: 2500, disableOnInteraction: false } : autoplay} // Set autoplay options
      loop={loop}
      thumbs={thumb}
      onSwiper={onswiper}
      effect={effect}
      watchSlidesProgress={watchslide}
      freeMode={freemode}
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      initialSlide={initialSlide}
      centeredSlides={centeredSlides}
      grabCursor={grabCursor}
      onSlideChange={onSlideChange}
      onInit={onInit}
      className={className}
      mousewheel={mousewheel}
      keyboard={keyboard}
      direction={direction}
      cubeEffect={cubeEffect}
      coverflowEffect={coverflowEffect}
      breakpoints={breakpoint}
      style={style}
      {...rest}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index} className={mainClass}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SpkSwiperJs;
