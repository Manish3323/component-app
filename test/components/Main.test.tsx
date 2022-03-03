import { render, screen } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import { Main } from '../../src/components/Main'

describe('Main component', () => {
  it('renders hello world', () => {
    render(<Main />)

    expect(screen.getByText('Hello world')).to.exist
  })
})
