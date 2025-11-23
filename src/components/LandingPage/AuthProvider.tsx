import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
interface AuthProviderProps {
    children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        const authenticated = isAuthenticated();
        const currentPath = location.pathname;

        // Public routes that don't need authentication
        const publicRoutes = [
            '/',
            '/about',
            '/features',
            '/testimonials',
            '/pricing',
            '/login',
            '/signup',
            '/forgot-password',
            '/reset-password',
            '/blog'
        ];

        const isPublicRoute = publicRoutes.includes(currentPath) || currentPath.startsWith('/blog/');
        const isAuthRoute = ['/login', '/signup'].includes(currentPath);

        if (authenticated) {
            // User is logged in
            if (isAuthRoute || currentPath === '/') {
                // Redirect to dashboard if on login/signup/home
                navigate('/dashboard', { replace: true });
            }
        } else {
            // User is not logged in
            if (!isPublicRoute) {
                // Redirect to login if trying to access protected route
                navigate('/login', { replace: true });
            }
        }

        setIsChecking(false);
    };

    // Show loading screen while checking authentication
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                    <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}