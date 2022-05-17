import React, { useState } from 'react';
import { withFirebase } from '../Firebase';
import { useForm, Controller } from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import { Container, Box, FormGroup, FormControl, Button,
    Input, InputLabel, FormHelperText, Snackbar, makeStyles,
    Radio, RadioGroup, FormControlLabel, FormLabel, LinearProgress, Link,
    Typography, CssBaseline, Avatar, Grid } from '@material-ui/core';
import { LockOpen as LockOutlinedIcon } from '@material-ui/icons'
import * as ROUTES from '../../Constants/routes';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
        errorText: {
            color: 'red'
        },
    })
);

const Copyright = props => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const theme = createTheme();

function SignUpPage (props) {
    const {register, handleSubmit, control, errors } = useForm();
    const [open, setOpen] = useState(false);
    const [authError, setAuthError] = useState('');
    const classes = useStyles();
    const dbRef = props.firebase.getFirestore().collection('users');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const passwordStrengthIndicator = ['very weak', 'weak', 'weak', 'medium', 'strong'];

    const onSubmit = data => {
        if (data.passwordOne === data.passwordTwo) {
            props.firebase.doCreateUserWithEmailAndPassword(data.email, data.passwordOne).then(authUser => {
                dbRef.doc(authUser.user.uid).set(data);
                props.history.push(ROUTES.HOME);
            }).catch(error => {
                setAuthError(error.message);
                setOpen(true);
            });
        } else {
            setAuthError('Please ensure password matches.');
            setOpen(true);
        }
    }
    
    return (
        <ThemeProvider >
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControl>
                                <InputLabel>Username</InputLabel>
                                <Input name="username" inputRef={register({ required: true })}/>
                                <FormHelperText>Enter the name you wish to be known by.</FormHelperText>
                                <FormHelperText>{errors.username && <span className={classes.errorText}>Username is required</span>}</FormHelperText>
                            </FormControl>
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel>Email</InputLabel>
                            <Input name="email" inputRef={register({ required: true })}/>
                            <FormHelperText>Enter the email you wish to register your account with</FormHelperText>
                            <FormHelperText>{errors.email && <span className={classes.errorText}>Email is required</span>}</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <InputLabel>Password</InputLabel>
                            <Input name="passwordOne" type="password" onChange={event => setPasswordStrength(zxcvbn(event.target.value))} inputRef={register({required: true})} />
                            <FormHelperText>{errors.passwordOne && <span className={classes.errorText}>Password is required</span>}</FormHelperText>
                            <div>
                                <LinearProgress  variant="determinate" value={(passwordStrength.score / 4) *100} />
                                <FormHelperText>Password Strength: {passwordStrengthIndicator[(passwordStrength.score)]}</FormHelperText>
                            </div>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormGroup>
                            <FormControl>
                                <InputLabel>Confirm Password</InputLabel>
                                <Input name="passwordTwo" type="password" inputRef={register({required: true})} />
                                <FormHelperText>{errors.passwordTwo && <span className={classes.errorText}>Please confirm your password is required</span>}</FormHelperText>
                            </FormControl>
                        </FormGroup>
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <FormGroup>
                        <p>Already have an account? Go to <Link to={ROUTES.SIGN_IN}>here</Link></p>
                    </FormGroup>
                </Grid>
                </Grid>
                <Snackbar
                    open={open} color='red' autoHideDuration={600} message={authError} action={
                        <Button color="inherit" size="small" onClick={() => setOpen(false)}>
                            X
                        </Button>
                    }
                />
            </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
        </Container>
        </ThemeProvider>
    )
}

export default withFirebase(SignUpPage);