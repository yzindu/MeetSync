// frontend/src/pages/auth/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await API.post('/auth/login', { email, password });

            login(response.data.user, response.data.token);
            toast.success('Welcome back!');

            if (response.data.user.role === 'Manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/member/reports');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4">

            <Card className="w-full max-w-sm shadow-xl border-border/50 relative overflow-hidden">

                {/* The sleek top gradient bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/80 to-primary" />

                <CardHeader className="text-center space-y-1 pt-8">
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">MeetSync</CardTitle>
                    <CardDescription>
                        Enter your details below to log in
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-muted/30 focus-visible:bg-white transition-colors"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-muted/30 focus-visible:bg-white transition-colors tracking-widest placeholder:tracking-normal"
                                placeholder="••••••••"
                            />
                        </div>

                        <Button type="submit" className="w-full mt-2 transition-all hover:scale-[1.01]" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </CardContent>

                <CardFooter className="justify-center pb-8">
                    <div className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}