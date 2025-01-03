import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Career from './Career';
import { post } from '../../api/api.ts';
jest.mock('../../api/api.ts');
jest.mock('react-toastify', () => ({
    ToastContainer: jest.fn(),
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Career Component', () => {
    it('renders Career component', async () => {
        render(<Career />);

        await waitFor(() => expect(screen.getByText('Score: Not evaluated')).toBeTruthy());
    });

    it('should show confetti when career level is evaluated', async () => {
        render(<Career />);

        fireEvent.click(screen.getByText('Evaluate 🎉'));

        await waitFor(() => expect(screen.getByText('Score:')).toBeTruthy());
    });

    it('should show the "Book Review" button when career level is evaluated', async () => {
        render(<Career />);

        fireEvent.click(screen.getByText('Evaluate 🎉'));

        await waitFor(() => expect(screen.getByText('Book Review')).toBeTruthy());
    });

    it('should trigger review request creation on submit', async () => {
        render(<Career />);

        fireEvent.click(screen.getByText('Evaluate 🎉'));
        fireEvent.click(screen.getByText('Book Review'));

        await waitFor(() => expect(screen.getByText('Send')).toBeTruthy());
        fireEvent.click(screen.getByText('Send'));

        expect(post).toHaveBeenCalledTimes(1);
    });

    it('should not submit if date is not selected', async () => {
        render(<Career />);

        fireEvent.click(screen.getByText('Evaluate 🎉'));
        fireEvent.click(screen.getByText('Book Review'));
        fireEvent.click(screen.getByText('Send'));

        expect(screen.getByText('Please select a date!')).toBeTruthy();
    });
});
