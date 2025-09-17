import React, { useState } from 'react';
import { AuthForm } from './AuthForm';

export function Login({ onLoginSuccess, onSwitchToSignup }) {
    const [formState, setFormState] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Call the success handler from App.jsx
            onLoginSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthForm
            title="Login"
            formState={formState}
            setFormState={setFormState}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={error}
        >
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <button type="button" onClick={onSwitchToSignup} className="font-medium text-indigo-600 hover:text-indigo-500">Sign Up</button>
            </p>
        </AuthForm>
    );
}
