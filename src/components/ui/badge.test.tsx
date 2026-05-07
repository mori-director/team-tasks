import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('텍스트를 렌더링한다', () => {
    render(<Badge>할 일</Badge>)
    expect(screen.getByText('할 일')).toBeInTheDocument()
  })

  it('default variant가 기본 적용된다', () => {
    const { container } = render(<Badge>default</Badge>)
    expect(container.firstChild).toHaveClass('bg-primary')
  })

  it('secondary variant가 적용된다', () => {
    const { container } = render(<Badge variant="secondary">완료</Badge>)
    expect(container.firstChild).toHaveClass('bg-secondary')
  })

  it('outline variant가 적용된다', () => {
    const { container } = render(<Badge variant="outline">outline</Badge>)
    expect(container.firstChild).toHaveClass('border-border')
  })

  it('className prop이 병합된다', () => {
    const { container } = render(<Badge className="custom-class">badge</Badge>)
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
