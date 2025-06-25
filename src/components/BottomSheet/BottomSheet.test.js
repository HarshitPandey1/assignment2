import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BottomSheet from './BottomSheet';

describe('BottomSheet Component', () => {
  test('Renders the heading text "Bottom Sheet"', () => {
    render(<BottomSheet />);
    const heading = screen.getByText('Bottom Sheet'); 
    expect(heading).toBeInTheDocument();
  });

  test('Renders all 3 buttons correctly', () => {
    render(<BottomSheet />);
    expect(screen.getByText('Open Full')).toBeInTheDocument();
    expect(screen.getByText('Half Open')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  test('"Open Full" button moves sheet to top (60px)', async () => {
    const { container } = render(<BottomSheet />);
    fireEvent.click(screen.getByText('Open Full'));

    const sheet = container.querySelector('.bottom-sheet');
    await waitFor(() => {
      expect(sheet.style.transform).toContain('translateY(60px)');
    });
  });

  test('"Half Open" button moves sheet to middle of screen', async () => {
    const { container } = render(<BottomSheet />);
    fireEvent.click(screen.getByText('Half Open'));

    const sheet = container.querySelector('.bottom-sheet');
    await waitFor(() => {
      const yVal = parseFloat(sheet.style.transform.match(/translateY\((.*?)px\)/)?.[1]);
      const expected = window.innerHeight * 0.5;
      expect(Math.abs(yVal - expected)).toBeLessThan(10); // margin of error for animation rounding
    });
  });

  test('"Close" button moves sheet to bottom (off screen)', async () => {
    const { container } = render(<BottomSheet />);
    fireEvent.click(screen.getByText('Close'));

    const sheet = container.querySelector('.bottom-sheet');
    await waitFor(() => {
      const yVal = parseFloat(sheet.style.transform.match(/translateY\((.*?)px\)/)?.[1]);
      expect(yVal).toBeGreaterThanOrEqual(window.innerHeight - 10); // approx bottom
    });
  });
});
