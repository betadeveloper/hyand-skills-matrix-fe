import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { post } from '../../api/api.ts';

jest.mock('../../api/api.ts', () => ({
    post: jest.fn(),
}));

describe('Register Component', () => {
    it('renders the form with the correct elements', () => {
        render(
          <BrowserRouter>
              <Register />
          </BrowserRouter>
        );

        expect(screen.getByLabelText(/first name/i)).toBeTruthy();
        expect(screen.getByLabelText(/last name/i)).toBeTruthy();
        expect(screen.getByLabelText(/email address/i)).toBeTruthy();
        expect(screen.getByLabelText(/password/i)).toBeTruthy();
        expect(screen.getByLabelText(/confirm password/i)).toBeTruthy();
        expect(screen.getByRole('button', { name: /register/i })).toBeTruthy();
    });

    it('shows error messages when fields are invalid', async () => {
        render(
          <BrowserRouter>
              <Register />
          </BrowserRouter>
        );

        fireEvent.submit(screen.getByRole('form'));

        expect(await screen.findByText(/first name is required/i)).toBeTruthy();
        expect(await screen.findByText(/last name is required/i)).toBeTruthy();
        expect(await screen.findByText(/email is required/i)).toBeTruthy();
        expect(await screen.findByText(/password is required/i)).toBeTruthy();
        expect(await screen.findByText(/confirm password is required/i)).toBeTruthy();
    });

    it('submits the form successfully', async () => {
        const firstName = screen.getByLabelText(/first name/i);
        const lastName = screen.getByLabelText(/last name/i);
        const email = screen.getByLabelText(/email address/i);
        const password = screen.getByLabelText(/password/i);
        const confirmPassword = screen.getByLabelText(/confirm password/i);

        fireEvent.change(firstName, { target: { value: 'John' } });
        fireEvent.change(lastName, { target: { value: 'Doe' } });
        fireEvent.change(email, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(password, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPassword, { target: { value: 'Password123!' } });

        fireEvent.submit(screen.getByRole('form'));

        await waitFor(() => expect(post).toHaveBeenCalledWith('/auth/signup', expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            password: 'Password123!',
        })));
    });

    it('displays an error message when the user already exists', async () => {
        render(
          <BrowserRouter>
              <Register />
          </BrowserRouter>
        );

        const firstName = screen.getByLabelText(/first name/i);
        const lastName = screen.getByLabelText(/last name/i);
        const email = screen.getByLabelText(/email address/i);
        const password = screen.getByLabelText(/password/i);
        const confirmPassword = screen.getByLabelText(/confirm password/i);

        fireEvent.change(firstName, { target: { value: 'John' } });
        fireEvent.change(lastName, { target: { value: 'Doe' } });
        fireEvent.change(email, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(password, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPassword, { target: { value: 'Password123!' } });

        fireEvent.submit(screen.getByRole('form'));

        await waitFor(() => {
            expect(screen.getByText('User already exists')).toBeTruthy();
        });
    });

    it('displays a generic error message when an error occurs', async () => {
        render(
          <BrowserRouter>
              <Register />
          </BrowserRouter>
        );

        const firstName = screen.getByLabelText(/first name/i);
        const lastName = screen.getByLabelText(/last name/i);
        const email = screen.getByLabelText(/email address/i);
        const password = screen.getByLabelText(/password/i);
        const confirmPassword = screen.getByLabelText(/confirm password/i);

        fireEvent.change(firstName, { target: { value: 'John' } });
        fireEvent.change(lastName, { target: { value: 'Doe' } });
        fireEvent.change(email, { target: { value: 'john.doe@example.com' } });
        fireEvent.change(password, { target: { value: 'Password123!' } });
        fireEvent.change(confirmPassword, { target: { value: 'Password123!' } });

        fireEvent.submit(screen.getByRole('form'));

        await waitFor(() => {
            expect(screen.getByText('Internal Server Error')).toBeTruthy();
        });
    });
});
