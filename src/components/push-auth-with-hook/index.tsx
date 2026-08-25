import { Card, CardContent, Typography, CircularProgress, CardActions, Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { usePushAuthRunner } from '../../hooks/pushAuthHook';
import { checkChallengeStatus, requestChallenge } from '../../service/authService';
import { useQuery } from '@tanstack/react-query';

export const PushAuthWithHook: React.FC<{}> = () => {
    const [status, setStatus] = useState("idle");

    const authRunner = usePushAuthRunner();

    const query = useQuery({ queryKey: ['test'], queryFn: requestChallenge, enabled: false });

    const { data, error, isPending, isError, isLoading } = query;

    const handleAuth = useCallback(() => {
        setStatus("pending");

        authRunner.start("challenge-123", {
            checkStatus: checkChallengeStatus,
            onEvent: (e: { type: string }) => {
                if (e.type === "APPROVED") setStatus("approved");
                if (e.type === "REJECTED") setStatus("rejected");
                if (e.type === "TIMEOUT") setStatus("timeout");
            },
        })
    }, []);
    
    return (
        <Card sx={{ margin: '10px' }}>
            <CardContent>
                <Typography variant='h3'>{`Authenticate (with hook)`}</Typography>
                {status === "pending" && <CircularProgress /> }
                <Typography variant='body1'>
                    {status === "approved" ? 'Authenticated' : 'Not Authenticated'}
                </Typography>
                <Typography>{data?.data || 'Not processed'}</Typography>
            </CardContent>
            <CardActions>
                <Button onClick={handleAuth}>Send Push notification</Button>
                <Button onClick={_ => query.refetch()}>Query Challenge</Button>
            </CardActions>
        </Card>
    );
}