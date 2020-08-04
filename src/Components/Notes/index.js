import React, { useEffect } from 'react';

import {  withAuthorization } from '../Session';
import { withStyles } from '@material-ui/core/styles';
const style = theme => ({
    appBar: {
      position: 'relative',
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    bottomNav: {
        position: 'fixed',
        bottom: 0,
        width: '100%',
    }
});

function Notes (props) {
    const notesRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('notes');
    const classes = { props };

    return (
        <div>POOP</div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Notes));