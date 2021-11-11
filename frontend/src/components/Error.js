import React from 'react';
import { Alert } from 'react-bootstrap';

const Error = ( {variant, children }) => {
    return <div>
        <Alert variant={variant}>
            {children}
        </Alert>
    </div>
}

Error.defaultProps = {
    variant: 'info'
}

export default Error;