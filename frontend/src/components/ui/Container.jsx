import { cn } from '../../utils/cn'

export default function Container({ children, className, as: Tag = 'div' }) {
  return (
    <Tag
      className={cn(
        'mx-auto w-full max-w-6xl px-4 sm:px-5 md:px-6 lg:max-w-7xl lg:px-8',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
