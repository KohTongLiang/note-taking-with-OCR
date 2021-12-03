import React, { useEffect, useState } from 'react';

import {  withAuthorization } from '../Session';
import { Container, Card, CardContent, CardActionArea, Typography,
  CardActions, Button, IconButton, Divider, Grid } from '@material-ui/core';
import { Delete as DeleteIcon, Edit as EditIcon, List as ListIcon, 
  ViewColumn as ViewColumnIcon  } from '@material-ui/icons';
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
    },
    cardAction: {
      flex: 1,
    }
});

function Notes (props) {
    const notesRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('notes');
    const [noteList, setNoteList] = useState([]);
    const [noteView, setNoteView] = useState(0); // 0 = list, 1 = column
    const { classes } = props;

    useEffect(() => {
      const unsubscribe = notesRef.onSnapshot(snapshot => {
        let notes = [];
        snapshot.forEach(e => {
          notes.push({
            id : e.id,
            title : e.data().title,
            content : e.data().content,
          })
        });
        setNoteList(notes);
      });
    });

    const deleteNotes = id => {
      notesRef.doc(id).delete();
    }

    return (
      <div>
        <Container>
          <div>
            <IconButton onClick={()=>setNoteView(0)}><ListIcon /></IconButton>
            <IconButton onClick={()=>setNoteView(1)}><ViewColumnIcon /></IconButton>
          </div>
          <Divider />
          {(noteView === 0 && noteList) && noteList.map(e => (
            <Card key={e.id} className={classes.cardRoot}>
              <CardActions>
                <div className={classes.cardAction}>
                  <Typography variant="h5">
                    {e.title}
                  </Typography>
                </div>
                <IconButton onClick={() => props.editFormHandler(e)}><EditIcon/></IconButton>
                <IconButton onClick={() => deleteNotes(e.id)}><DeleteIcon/></IconButton>
              </CardActions>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1" onClick={() => props.viewFormHandler(e)}>
                    {e.content}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <div className={classes.cardAction}>
                  <Button size="small">Share</Button>
                  <Button size="small">Archive</Button>
                </div>
              </CardActions>
            </Card>
          ))}

          <Grid container spacing={3}>
            {(noteView === 1 && noteList) && noteList.map(e => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card key={e.id} className={classes.cardRoot}>
                  <CardActions>
                    <div className={classes.cardAction}>
                      <Typography variant="h5">
                        {e.title}
                      </Typography>
                    </div>
                    <IconButton onClick={() => props.editFormHandler(e)}><EditIcon/></IconButton>
                    <IconButton onClick={() => deleteNotes(e.id)}><DeleteIcon/></IconButton>
                  </CardActions>
                  <CardActionArea>
                    <CardContent>
                      <Typography variant="body1" onClick={() => props.viewFormHandler(e)}>
                        {e.content}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <div className={classes.cardAction}>
                      <Button size="small">Share</Button>
                      <Button size="small">Archive</Button>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Notes));