import {useEffect, RefObject} from 'react'

// Proper custom hook to follow the Rules of Hooks
export function useActiveScroll<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  topOffset: number = 80
) {
  useEffect(() => {
    const element = ref?.current
    const listener = () => {
      if (window.scrollY > topOffset) {
        element?.classList.add('is-scrolling')
      } else {
        element?.classList.remove('is-scrolling')
      }
    }
    document.addEventListener('scroll', listener)
    return () => {
      document.removeEventListener('scroll', listener)
    }
  }, [ref, topOffset])
}