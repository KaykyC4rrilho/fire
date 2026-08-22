'use client'

import * as React from 'react'
import {
  motion,
  type HTMLMotionProps,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react'
import { cn } from '../../lib/utils'

interface ParallaxItemProps extends HTMLMotionProps<'div'> {
  start: number
  end: number
}

export const Parallax = ({
  className,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'relative min-h-dvh w-full',
        className,
      )}
      {...props}
    />
  )
}

export function PrallaxContainer({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'min-h-screen px-6 sm:px-10 lg:px-16',
        className,
      )}
      {...props}
    />
  )
}

export function ParallaxItem({
  start,
  end,
  className,
  style,
  ...props
}: ParallaxItemProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [
      `${start}px end`,
      `end ${end * -1}px`,
    ],
  })

  const opacity = useTransform(
    scrollYProgress,
    [0.75, 1],
    [1, 0],
  )

  const scale = useTransform(
    scrollYProgress,
    [0.75, 1],
    [1, 0.85],
  )

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [start, end],
  )

  const transform =
    useMotionTemplate`translateY(${y}px) scale(${scale})`

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform,
        opacity,
        ...style,
      }}
      {...props}
    />
  )
}