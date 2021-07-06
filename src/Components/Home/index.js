import React, { useState } from 'react';
import { Container, Box, Fab } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';

import {  withAuthorization } from '../Session';
import CreateNotes from '../Notes/create';
import ViewNotes from '../Notes/view';
import Notes from '../Notes';
import { withStyles } from '@material-ui/core/styles';

const style = theme => ({
  fab: {
    margin: 0,
    top: 'auto',
    left: 'auto',
    bottom: 20,
    right: 20,
    position: 'fixed',
  }
})

function Home (props) {
  const [createNotesShow, setCreateNotesShow] = useState(false);
  const [viewNotesShow, setViewNotesShow] = useState(false);
  const [notesObj, setNotesObj] = useState({
    id: '',
    title: '',
    content: '',
  });
  const {classes} = props;

  const editFormHandler = noteObj => {
    setCreateNotesShow(true);
    setNotesObj(noteObj);
  }

  const viewFormHandler = noteObj => {
    console.log(noteObj)
    setViewNotesShow(true);
    setNotesObj(noteObj);
  }

  const handleClose = () => {
    setNotesObj({
      id: '',
      title: '',
      content: '',
    });
    setCreateNotesShow(false);
    setViewNotesShow(false);
  }

  return (
    <Box>
      <Container>
        <Notes editFormHandler={editFormHandler} viewFormHandler={viewFormHandler} />
        { createNotesShow && (<CreateNotes show={createNotesShow} notesObj={notesObj} close={handleClose}/>) }
        { viewNotesShow && (<ViewNotes show={viewNotesShow} notesObj={notesObj} close={handleClose} />)}
      </Container>
      <Fab color="primary" onClick={() => setCreateNotesShow(!createNotesShow)} className={classes.fab} aria-label="add">
          <CreateIcon />
      </Fab>
    </Box>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Home));
