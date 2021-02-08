import { useState } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/useRequest';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const { doRequest, errors} = useRequest({
        url: '/api/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    });

    const onBlur = () => {
        const value = parseFloat(price);
        
        if(isNaN(value)) {
            return;
        }

        setPrice(value.toFixed(2));
    };

    const onSubmit = (e) => {
        e.preventDefault();

        doRequest();
    }

    return  (
        <div>
            <h1>Create a ticket</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="">Title</label>
                    <input 
                        className="form-control"
                        value={title}
                        onChange={ (e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Price</label>
                    <input 
                        className="form-control"
                        value={price}
                        onBlur={onBlur}
                        onChange={ (e) => setPrice(e.target.value)}
                    />
                </div>
                {errors}
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default NewTicket;