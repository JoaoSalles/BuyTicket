import { useState } from 'react';
import Routes from 'next/router';
import useRequest from '../../hooks/useRequest';

const signup = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const { doRequest, errors } = useRequest({ 
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password
        },
        onSuccess: () => {
            Routes.push('/');
        }
    })
    const onEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        
        doRequest();
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value={email} onChange={onEmailChange} className="form-control" />
                <label>Password</label>
                <input value={password} onChange={onPasswordChange} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}

export default signup;