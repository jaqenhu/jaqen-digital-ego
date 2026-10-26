import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Flip } from 'gsap/Flip'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, Flip, ScrollTrigger)

export { gsap, useGSAP, Flip, ScrollTrigger }
