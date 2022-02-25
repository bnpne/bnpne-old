import LocomotiveScroll from 'locomotive-scroll'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
const scrollEl = '[data-scroll-container]'

const locoScroll = new LocomotiveScroll({
  el: document.querySelector(scrollEl),
  smooth: true,
  lerp: 0.987,
  smartphone: {
    smooth: false,
  },
  tablet: {
    smooth: false,
  },
})

if (
  document.querySelector(scrollEl).getAttribute('data-horizontal') == 'true'
) {
  options.direction = 'horizontal'
  options.gestureDirection = 'both'
  options.tablet = {
    smooth: true,
    direction: 'horizontal',
    horizontalGesture: true,
  }
  options.smartphone = {
    smooth: false,
  }
  options.reloadOnContextChange = true
}

locoScroll.on('scroll', ScrollTrigger.update)

ScrollTrigger.scrollerProxy(scrollEl, {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector(scrollEl).style.transform
    ? 'transform'
    : 'fixed',
})

// ADD TIMELINE

var introTl = gsap.timeline({
  defaults: {
    ease: 'power2.fadeIn',
    duration: 0.9,
  },
})

introTl.from('.card__hero', {
  opacity: 0,
  x: -20,
})
introTl.from(
  '.nav',
  {
    opacity: 0,
    y: 10,
    delay: 0.8,
  },
  '<'
)
introTl.from(
  '.hero__text',
  {
    opacity: 0,
    y: 10,
  },
  '<'
)

var workTl = gsap.timeline({
  scrollTrigger: {
    trigger: '.work',
    scroller: scrollEl,
    start: 'top 10%',
    end: 'top bottom',
    scrub: 1,
  },
})

workTl.to('.page__container', {
  backgroundColor: '#131515',
  color: '#fffafb',
  ease: 'power2',
})
workTl.to(
  '.nav',
  {
    color: '#fffafb',
    ease: 'power2',
  },
  '<'
)

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
ScrollTrigger.addEventListener('refresh', () => locoScroll.update())

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh()
