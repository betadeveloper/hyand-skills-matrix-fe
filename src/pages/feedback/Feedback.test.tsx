import { render, screen, waitFor } from '@testing-library/react';
import Feedback from './Feedback';

jest.mock('../../api/api', () => ({
    get: jest.fn(),
}));

describe('Feedback Component', () => {
    it('renders Feedback page correctly', async () => {
        const mockFeedback = [
            {
                feedbackText: 'Great work!',
                owner: { firstName: 'John', lastName: 'Doe' },
                createdAt: '2025-01-01T12:00:00Z',
            },
        ];

        render(<Feedback />);

        expect(screen.getByText('Feedback')).toBeTruthy();

        await waitFor(() => screen.getByText('Great work!'));

        expect(screen.getByText('"Great work!"')).toBeTruthy();
        expect(screen.getByText('Given by: John Doe')).toBeTruthy();
        expect(screen.getByText('on: January 1, 2025, 12:00 PM')).toBeTruthy();
        expect(mockFeedback).toBeTruthy();
    });

    it('displays error message when feedback fetch fails', async () => {

        render(<Feedback />);

        await waitFor(() => screen.getByText('Failed to load feedback'));

        expect(screen.getByText('Failed to load feedback')).toBeTruthy();
    });

    it('displays no feedback message when no feedback is available', async () => {

        render(<Feedback />);

        await waitFor(() => screen.getByText('No feedback available yet'));

        expect(screen.getByText('No feedback available yet')).toBeTruthy();
    });

    it('shows Give Feedback button for admin users', async () => {
        const mockFeedback = [
            {
                feedbackText: 'Great work!',
                owner: { firstName: 'John', lastName: 'Doe' },
                createdAt: '2025-01-01T12:00:00Z',
            },
        ];

        const mockRoles = ['ROLE_ADMIN'];
        localStorage.setItem('roles', JSON.stringify(mockRoles));

        render(<Feedback />);

        await waitFor(() => screen.getByText('Great work!'));

        expect(screen.getByText('Give Feedback')).toBeTruthy();
        expect(mockFeedback).toBeTruthy();
    });
});
