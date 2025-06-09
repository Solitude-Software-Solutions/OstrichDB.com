import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
import HeaderMenu from '../../components/dashboard/HeaderMenu';
// import classes from './HeaderMenu.module.css';


// Mock the CSS modules since Jest doesn't handle them by default
jest.mock('./HeaderMenu.module.css', () => ({
  header: 'header',
  inner: 'inner',
  logo: 'logo',
  actions: 'actions'
}));

// Mock the ThemeToggle component since it's imported
// Update your mock in HeaderMenu.test.tsx to use an absolute path
jest.mock('@/components/common/ThemeToggle', () => ({
  __esModule: true,
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Circle: () => <div data-testid="circle-icon">Circle</div>,
  HelpCircleIcon: () => <div data-testid="help-circle-icon">Help Circle</div>
}));

// Helper function to render component with Mantine provider
const renderWithMantine = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('HeaderMenu Component', () => {
  test('renders without crashing', () => {
    renderWithMantine(<HeaderMenu />);
  });

  test('displays the logo text "Ostrich DB"', () => {
    renderWithMantine(<HeaderMenu />);
    
    expect(screen.getByText('Ostrich')).toBeInTheDocument();
    expect(screen.getByText('DB')).toBeInTheDocument();
  });

  test('renders the Circle icon in the logo', () => {
    renderWithMantine(<HeaderMenu />);
    
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
  });

  test('renders the ThemeToggle component', () => {
    renderWithMantine(<HeaderMenu />);
    
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  test('renders the HelpCircleIcon in actions section', () => {
    renderWithMantine(<HeaderMenu />);
    
    expect(screen.getByTestId('help-circle-icon')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = renderWithMantine(<HeaderMenu />);
    
    // Check if the header element has the correct class
    const headerElement = container.querySelector('.header');
    expect(headerElement).toBeInTheDocument();
  });

  test('has proper structure with Container and Group components', () => {
    renderWithMantine(<HeaderMenu />);
    
    // Verify that both logo and actions sections are present
    expect(screen.getByText('Ostrich')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('help-circle-icon')).toBeInTheDocument();
  });

  test('logo section contains both text and icon', () => {
    renderWithMantine(<HeaderMenu />);
    
    // Check that logo section has both the Circle icon and text
    expect(screen.getByTestId('circle-icon')).toBeInTheDocument();
    expect(screen.getByText('Ostrich')).toBeInTheDocument();
    expect(screen.getByText('DB')).toBeInTheDocument();
  });

  test('actions section contains both ThemeToggle and HelpCircleIcon', () => {
    renderWithMantine(<HeaderMenu />);
    
    // Verify both action components are rendered
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('help-circle-icon')).toBeInTheDocument();
  });
});