import React from 'react';
import { DialogContent, Typography, Dialog, AppBar, Toolbar, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
    import * as Transition from '../../Constants/transition';
import { withStyles } from '@material-ui/core/styles';

import {  withAuthorization } from '../Session';

const style = theme => ({
    appBar: {
      position: 'relative',
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    dialog: {
        width: '100%'
    }
  });

function ViewNotes (props) {
    const { classes } = props;

    return (
        <div>
        <Dialog
            open={props.show}
            className={classes.dialog}
            onClose={props.close} 
            TransitionComponent={Transition.SlideUpDialog}
            scroll="body"
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.dialogTitle}>
                        { props.notesObj.title }
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <p>
                    {props.notesObj.content}
                </p>
            </DialogContent>
        </Dialog>
    </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(ViewNotes));