import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../Profile';
import { AuthContext } from '../../context/AuthContext';
import { describe, it, expect, vi } from 'vitest';

const mockUser = {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    credits: 100,
    giveScore: 50,
    totalHoursGiven: 10,
    totalHoursReceived: 5,
    bio: 'Test Bio',
    skillsOffered: ['React'],
    skillsWanted: ['Node'],
    avatar: 'avatar.png'
};

const mockLogin = vi.fn();
const mockLogout = vi.fn();

describe('Profile Page', () => {
    it('renders user stats', () => {
        render(
            <AuthContext.Provider value={{ user: mockUser, login: mockLogin, logout: mockLogout, isAuthenticated: true, loading: false }}>
                <BrowserRouter>
                    <Profile />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument(); // Credits
        expect(screen.getByText('50')).toBeInTheDocument(); // Give Score
    });
});
