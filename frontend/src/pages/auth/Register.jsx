import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { toast } from 'sonner';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Member'); // <-- New state for Role
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // We now send the selected role to the backend!
            const response = await API.post('/auth/register', { name, email, password, role });

            login(response.data.user, response.data.token);
            toast.success('Account created successfully!');

            // Route them based on the role they just registered with
            if (response.data.user.role === 'Manager') {
                navigate('/manager/dashboard');
            } else {
                navigate('/member/reports');
            }

        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-primary/5 via-background to-secondary/10 p-4">

            <Card className="w-full max-w-[420px] shadow-xl border-border/50 relative overflow-hidden">

                {/* Top Gradient Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary/80 to-primary" />

                <CardHeader className="text-center space-y-1 pt-8 pb-4">
                    <CardTitle className="text-2xl font-bold tracking-tight text-primary">Create Account</CardTitle>
                    <CardDescription>
                        Enter your details to get started with MeetSync
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">

                        {/* Full Name Input */}
                        <div className="space-y-1.5 text-left">
                            <Label htmlFor="name" className="font-semibold text-foreground text-sm">Full Name</Label>
                            <div className="flex items-center gap-2 px-3 h-11 rounded-md bg-muted/30 border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <User className="h-4 w-4 text-muted-foreground shrink-0" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Yasindu Janapriya"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-full"
                                />
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5 text-left">
                            <Label htmlFor="email" className="font-semibold text-foreground text-sm">Email address</Label>
                            <div className="flex items-center gap-2 px-3 h-11 rounded-md bg-muted/30 border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Password Input */}
                            <div className="space-y-1.5 text-left">
                                <Label htmlFor="password" className="font-semibold text-foreground text-sm">Password</Label>
                                <div className="flex items-center gap-2 px-3 h-11 rounded-md bg-muted/30 border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-full tracking-widest placeholder:tracking-normal"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1.5 text-left">
                                <Label htmlFor="confirmPassword" className="font-semibold text-foreground text-sm">Confirm</Label>
                                <div className="flex items-center gap-2 px-3 h-11 rounded-md bg-muted/30 border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-full tracking-widest placeholder:tracking-normal"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Type Selector */}
                        <div className="space-y-1.5 text-left">
                            <Label className="font-semibold text-foreground text-sm">Account Type</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="h-11 bg-muted/30 border-transparent hover:bg-muted/50 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-white transition-all shadow-none">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Member">Team Member</SelectItem>
                                    <SelectItem value="Manager">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full mt-4 h-11 text-md font-semibold tracking-wide transition-all hover:scale-[1.01] shadow-md flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating Account..." : (
                                <>
                                    Sign Up <UserPlus className="w-4 h-4" />
                                </>
                            )}
                        </Button>

                    </form>
                </CardContent>

                <CardFooter className="justify-center pb-8 pt-2">
                    <div className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-primary hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>

            </Card>

        </div>
    );
}