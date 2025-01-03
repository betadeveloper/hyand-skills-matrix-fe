import { render, screen } from '@testing-library/react';
import Home from './Home';

jest.mock('../../components/goals-card/GoalsCard', () => () => <div>GoalsCard</div>);
jest.mock('../../components/progress-card/ProgressCard', () => () => <div>ProgressCard</div>);
jest.mock('../../components/owners-card/OwnersCard', () => () => <div>OwnersCard</div>);

describe('Home Component', () => {
    it('renders home page and child components', () => {
        render(<Home />);

        expect(screen.getByText('GoalsCard')).toBeTruthy();
        expect(screen.getByText('ProgressCard')).toBeTruthy();
        expect(screen.getByText('OwnersCard')).toBeTruthy();
    });

    it('has correct structure with child components', () => {
        render(<Home />);

        const goalsCard = screen.getByText('GoalsCard');
        const progressCard = screen.getByText('ProgressCard');
        const ownersCard = screen.getByText('OwnersCard');

        expect(goalsCard).toBeTruthy();
        expect(progressCard).toBeTruthy();
        expect(ownersCard).toBeTruthy();
    });
});
