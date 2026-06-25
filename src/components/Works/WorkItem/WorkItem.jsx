import React, { useState, useCallback, useRef } from 'react'
import { DotButton } from './CarouselDotButton'
import {
  PrevButton,
  NextButton
} from './CarouselArrowButtons'
import styles from './WorkItem.module.css'

const WorkItem = (props) => {
  const { work, slides, options, variant = 'large' } = props
  const [selectedIndex, setSelectedIndex] = useState(0)
  const containerRef = useRef(null)
  const isLoop = options?.loop || false

  const scrollToIndex = useCallback((index) => {
    if (!containerRef.current) return
    const slideWidth = containerRef.current.offsetWidth
    containerRef.current.scrollTo({
      left: slideWidth * index,
      behavior: 'smooth'
    })
    setSelectedIndex(index)
  }, [])

  const onPrevButtonClick = useCallback(() => {
    const newIndex = selectedIndex === 0 
      ? (isLoop ? slides.length - 1 : 0) 
      : selectedIndex - 1
    scrollToIndex(newIndex)
  }, [selectedIndex, slides.length, isLoop, scrollToIndex])

  const onNextButtonClick = useCallback(() => {
    const newIndex = selectedIndex === slides.length - 1 
      ? (isLoop ? 0 : slides.length - 1) 
      : selectedIndex + 1
    scrollToIndex(newIndex)
  }, [selectedIndex, slides.length, isLoop, scrollToIndex])

  const prevBtnDisabled = !isLoop && selectedIndex === 0
  const nextBtnDisabled = !isLoop && selectedIndex === slides.length - 1

  return (
    <section className={styles.carousel}>
      <div className={styles.carouselViewport}>
        <div className={styles.carouselContainer} ref={containerRef}>
          {slides.map((index) => (
            <div className={styles.carouselSlide} key={index}>
              <div className={variant === 'small' ? styles.carouselSlideContentSmall : styles.carouselSlideContent}>
                {/* Placeholder para imagen - aquí irán las imágenes reales */}
                <div className={styles.slideImage}>
                  <span>Imagen {index + 1}</span>
                </div>
                
                {/* Título sobre la imagen */}
                {work && index === 0 && (
                  <h2 className={styles.slideTitle}>{work.title}</h2>
                )}
                
                {/* Overlay de tecnologías (hover) */}
                {work && (
                  <div className={styles.techOverlay}>
                    <h3>Tecnologías</h3>
                    <ul className={styles.techList}>
                      {work.technologies?.map((tech, i) => (
                        <li key={i}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.carouselControls}>
        <div className={styles.carouselButtons}>
          <PrevButton 
            onClick={onPrevButtonClick} 
            disabled={prevBtnDisabled}
            variant={variant}
          />
          <NextButton 
            onClick={onNextButtonClick} 
            disabled={nextBtnDisabled}
            variant={variant}
          />
        </div>

        <div className={styles.carouselDots}>
          {slides.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`${styles.carouselDot}${
                variant === 'small' ? ` ${styles.carouselDotSmall}` : ''
              }${
                index === selectedIndex ? ` ${styles.carouselDotSelected}` : ''
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkItem
