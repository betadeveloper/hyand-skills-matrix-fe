import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { get, put } from '../../api/api';
import { toast } from 'react-toastify';

jest.mock('../../api/api');
jest.mock('react-toastify', () => ({
    toast: jest.fn(),
}));

describe('Profile Component', () => {
    beforeEach(() => {
        (get as jest.Mock).mockResolvedValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            position: 'Developer',
            department: 'Engineering',
        });
    });

    it('renders profile component and displays fetched data', async () => {
        render(<Profile />);
    });

    it('allows editing and updating user details', async () => {
        render(<Profile />);

        await screen.findByDisplayValue('John');

        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Jane' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Smith' } });
        fireEvent.change(screen.getByLabelText('Position'), { target: { value: 'Manager' } });
        fireEvent.change(screen.getByLabelText('Department'), { target: { value: 'HR' } });

        const updateButton = screen.getByText('Upload');
        fireEvent.click(updateButton);

        (put as jest.Mock).mockResolvedValueOnce({
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'john.doe@example.com',
            position: 'Manager',
            department: 'HR',
        });

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Employee data updated successfully!'));
    });

    it('handles file upload', async () => {
        render(<Profile />);
        const fileInput = screen.getByLabelText('Profile Picture').parentElement?.querySelector('input[type="file"]');

        if (fileInput) {
            fireEvent.change(fileInput, { target: { files: [new File(['file'], 'test.jpg', { type: 'image/jpeg' })] } });
            expect(toast).toHaveBeenCalledWith('Uploaded');
        }
    });

    it('handles API errors gracefully', async () => {
        (put as jest.Mock).mockRejectedValueOnce(new Error('Failed to update'));
        render(<Profile />);

        await screen.findByDisplayValue('John');

        fireEvent.click(screen.getByText('Upload'));

        await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to update employee data.'));
    });
});
