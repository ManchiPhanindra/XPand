import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditOffer from '../EditOffer';
import { AuthContext } from '../../context/AuthContext';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from '../../services/api';

// Mock dependencies
vi.mock('../../services/offerService', () => ({
    updateOffer: vi.fn(),
}));

vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        delete: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        interceptors: {
            request: { use: vi.fn() },
            response: { use: vi.fn() }
        }
    }
}));

// Mock router params
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useParams: () => ({ id: '123' }),
        useNavigate: () => vi.fn(),
    };
});

const mockUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    credits: 100,
    giveScore: 50,
    totalHoursGiven: 10,
    totalHoursReceived: 5,
    bio: 'Test Bio',
    skillsOffered: [],
    skillsWanted: [],
    avatar: 'avatar.png'
};

describe('EditOffer Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('loads and displays offer data', async () => {
        // Mock API response
        (api.get as any).mockResolvedValue({
            data: {
                title: 'Existing Offer',
                description: 'Description',
                tag: 'React',
                duration: 60,
                credits: 20,
                prerequisites: 'None',
                availability: 'Weekends',
                format: 'One-on-One'
            }
        });

        render(
            <AuthContext.Provider value={{ user: mockUser, login: vi.fn(), logout: vi.fn(), isAuthenticated: true, loading: false }}>
                <BrowserRouter>
                    <EditOffer />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('Existing Offer')).toBeInTheDocument();
            expect(screen.getByDisplayValue('React')).toBeInTheDocument();
        });
    });
});
