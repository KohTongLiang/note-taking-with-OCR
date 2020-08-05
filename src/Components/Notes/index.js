import React, { useEffect, useState } from 'react';

import {  withAuthorization } from '../Session';
import { Container, Card, CardContent, CardActionArea, CardMedia, Typography,
  CardActions, Button } from '@material-ui/core';
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
    },
    cardRoot: {
      margin: 5,
    },
    cardMedia: {
      height: 140,
    }
});

function Notes (props) {
    const notesRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('notes');
    const [noteList, setNoteList] = useState([]);
    const {classes} = props;

    useEffect(() => {
      const unsubscribe = notesRef.onSnapshot(snapshot => {
        let notes = [];
        snapshot.forEach(e => {
          notes.push({
            id : e.key,
            title : e.data().title,
            content : e.data().content,
          })
        });
        setNoteList(notes);
      });
    },[])

    return (
      <div>
      <Container>
        {noteList && noteList.map(e => (
          <Card key={e.id} className={classes.cardRoot}>
            <CardActionArea>
              <CardContent>
                <Typography variant="h5">
                  {e.title}
                </Typography>
                <Typography variant="body1">
                  {e.content}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Archive</Button>
            </CardActions>
          </Card>
        ))}
      </Container>
      </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Notes));