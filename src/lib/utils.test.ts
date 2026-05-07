import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('단일 클래스 반환', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('여러 클래스 병합', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('falsy 값 무시', () => {
    expect(cn('foo', false, undefined, null, 'bar')).toBe('foo bar')
  })

  it('Tailwind 충돌 클래스는 마지막 값으로 덮어씀', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('조건부 클래스 적용', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active')
  })
})
