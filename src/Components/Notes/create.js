import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DialogContent, Typography, Dialog, AppBar, Toolbar, IconButton,
    FormGroup, FormControl, InputLabel, Input, BottomNavigation,
    BottomNavigationAction, DialogActions, Snackbar } from '@material-ui/core';
import { Close as CloseIcon, Save as SaveIcon, Image as ImageIcon, PhotoCamera as PhotoCameraIcon } from '@material-ui/icons';
import * as Transition from '../../Constants/transition';
import { withStyles } from '@material-ui/core/styles';
import { createWorker} from 'tesseract.js';

import {  withAuthorization } from '../Session';
import Camera from '../Camera';

const style = theme => ({
    appBar: {
       position: 'relative',
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    bottomNav: {
        // position: 'fixed',
        // bottom: 0,
        // flex: 1
        // width: '100%',
    },
    dialog: {
        width: '100%'
    },
  });

const worker = createWorker();

function CreateNotes (props) {
    const { classes } = props;
    const { handleSubmit, control, getValues, setValue } = useForm();
    const fileInput = useRef(null);
    const [imgUpload, setImgUpload] = useState([]);
    const [cameraMode, setCameraMode] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const notesRef = props.firebase.getFirestore().collection('users').doc(props.uid).collection('notes');

    const onSubmit = e => {
        if (props.notesObj.id !== '') {
            notesRef.doc(props.notesObj.id).set({
                title: e.title,
                content: e.content,
                updatedOn: new Date(),
            })
        } else {
            notesRef.add({
                title: e.title,
                content: e.content,
                createdOn: new Date(),
            });
        }

        props.close();
    }

    const doOCR = async() => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imgUpload[0]);
        setValue('content', text)
    }

    useEffect(() => {
        doOCR();
    }, [imgUpload]);


    const imageUpload = event => {
        if (event.target.files[0]) {
        var uploads = []
        for (var key in event.target.files) {
            if (!event.target.files.hasOwnProperty(key)) continue;
            let upload = event.target.files[key]
            uploads.push(URL.createObjectURL(upload))
        }
            setInProgress(true);
            setImgUpload(uploads);
        } else {
            setInProgress(false);
            setImgUpload([]);
        }
    }

    const imageTaken = blob => {
        let uploads = []
        uploads[0] = blob;
        setImgUpload(uploads);
        setCameraMode(false);
        setInProgress(true);
    }

    const formValues = getValues();

    return (
        <div>
        <Dialog
            className={classes.dialog}
            open={props.show}
            onClose={props.close} 
            TransitionComponent={Transition.SlideUpDialog}
            scroll="body"
            maxWidth='md'
            fullWidth={true}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.dialogTitle}>
                        Add Notes
                    </Typography>
                    <IconButton color="inherit">
                        <SaveIcon onClick={handleSubmit((data) => onSubmit(data))}/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            { !cameraMode && (
            <DialogContent>
                <form>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Title</InputLabel>
                            <Controller
                                as={<Input />}
                                name="title"
                                value={formValues.title}
                                defaultValue={props.notesObj.title}
                                onChange={e => setValue('title', e.target.value)}
                                control={control}
                                disableUnderline
                            />
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Content</InputLabel>
                            <Controller
                                as={<Input/>}
                                name="content"
                                type="text"
                                control={control}
                                value={formValues.content}
                                defaultValue={props.notesObj.content}
                                onChange={e => setValue('content', e.target.value)}
                                multiline
                                disableUnderline
                            />
                        </FormControl>
                    </FormGroup>
                </form>
                <input type="file" onChange={e => imageUpload(e)} ref={fileInput} hidden/>
                <BottomNavigation color="primary" className={classes.bottomNav} showLabels>
                    <BottomNavigationAction icon={<ImageIcon />} onClick={() => fileInput.current.click()} />
                    <BottomNavigationAction icon={<PhotoCameraIcon />} onClick={() => setCameraMode(true)}/>
                </BottomNavigation>
            </DialogContent>
            )}
            { cameraMode && (
                <Camera onCapture={blob => imageTaken(blob)} onClear={() => console.log('clear')}/>
            )}
            <DialogActions></DialogActions>
        </Dialog>

        <Snackbar open={inProgress} autoHideDuration={6000} onClose={() => setInProgress(!inProgress)} message='Translating...' />
    </div>
    )
}

const condition = authUser => !!authUser;
export default withAuthorization(condition)(withStyles(style)(CreateNotes));