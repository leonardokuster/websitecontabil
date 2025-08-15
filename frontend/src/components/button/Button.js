import * as React from 'react';
import { Button } from '@mui/material';
import styles from '@/components/button/button.module.css';

/*
 * types: action, delete, save, info
 * variant: contained, outlined, text
*/


export default function ButtonComponent(props) {

    const buttonClassName = styles[props.type];

    const buttonColor = () => {
        switch (props.type) {
            case 'back':
                return 'back';
            case 'save':
                return 'success';
            case 'delete':
                return 'error';
            case 'info':
                return 'info';
            default:
                return 'primary';
        }
    };

    return (
        <Button 
            variant={props.variant || 'contained'}
            color={buttonColor()}
            className={buttonClassName}
            onClick={props.onClick}
            >
                {props.label}
        </Button>
    );
}