import React, { useEffect, useState } from 'react';
import { Container, AppBar, Box, Fab } from '@material-ui/core';
import { Create as CreateIcon } from '@material-ui/icons';

import {  withAuthorization } from '../Session';
import CreateNotes from '../Notes/create';
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
  const {classes} = props;

  return (
    <Box>
      <Container>
        <Notes />
        { createNotesShow && (<CreateNotes show={createNotesShow} close={() => setCreateNotesShow(false)}/>) }
      </Container>

      <Fab color="primary" onClick={() => setCreateNotesShow(!createNotesShow)} className={classes.fab} aria-label="add">
          <CreateIcon />
      </Fab>
    </Box>
  );
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(Home));
