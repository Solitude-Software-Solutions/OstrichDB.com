import { render, screen } from '@testing-library/react';
import Footer from '../../components/dashboard/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renders all footer links correctly', () => {
    // Check documentation links
    expect(screen.getByText('Documentation')).toBeInTheDocument();
    expect(screen.getByText('Youtube')).toBeInTheDocument();
    expect(screen.getByText('Github')).toBeInTheDocument();
    
    // Check copyright and legal info
    expect(screen.getByText('Copyright Info')).toBeInTheDocument();
    expect(screen.getByText('Legal Information')).toBeInTheDocument();
  });

  test('all clickable elements have cursor-pointer class', () => {
    const buttons = screen.queryAllByRole('button');
    const links = screen.queryAllByRole('link');
    const clickableElements = [...buttons, ...links];
  
    clickableElements.forEach(el => {
      expect(el).toHaveClass('cursor-pointer');
    });
  });

  

  test('has correct layout classes', () => {
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('flex');
    expect(footer).toHaveClass('justify-between');
    expect(footer).toHaveClass('px-4');
    expect(footer).toHaveClass('py-3');
  });
});