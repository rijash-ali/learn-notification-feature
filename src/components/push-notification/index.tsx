import { Button, Card, CardActions, CardContent, CircularProgress, Typography } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { invokeAuthNotificationAction } from '../../store/push-auth/async-actions';
import { selectIsAuthenticated, selectPushAuth } from '../../store/push-auth/selectors';

export const PushNotification:React.FC<{}> = () => {
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(invokeAuthNotificationAction());
    };

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const { pageAttributes: { isAuthenticating } } = useSelector(selectPushAuth); 

    return (
        <Card>
            <CardContent>
                <Typography variant='h3'>Authenticate</Typography>
                {isAuthenticating && <CircularProgress /> }
                <Typography variant='body1'>
                    {isAuthenticated ? 'Authenticated' : 'Sent push notification'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleClick}>Send Push notification</Button>
            </CardActions>
        </Card>
    );
};