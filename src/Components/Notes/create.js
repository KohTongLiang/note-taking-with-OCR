import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { DialogContent, Typography, Dialog, AppBar, Toolbar, IconButton,
    FormGroup, FormControl, InputLabel, Input, BottomNavigation, BottomNavigationAction, DialogActions } from '@material-ui/core';
import Camera from 'react-html5-camera-photo';
import { Close as CloseIcon, Save as SaveIcon, Image as ImageIcon, PhotoCamera as PhotoCameraIcon,
    Mic as MicIcon, Brush as BrushIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { createWorker} from 'tesseract.js';

import * as Transition from '../../Constants/transition';

const style = theme => ({
    appBar: {
      position: 'relative',
    },
    dialogTitle: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  });

const worker = createWorker();

function CreateNotes (props) {
    const { classes } = props;
    const {handleSubmit, control } = useForm();
    const fileInput = useRef(null);
    const [imgUpload, setImgUpload] = useState([]);
    const [imgToText, setImgToText] = useState('');

    const onSubmit = e => {
        console.log(e.data);
    }

    const doOCR = async() => {
        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        const { data: { text } } = await worker.recognize(imgUpload[0]);
        setImgToText(text);
    }

    useEffect(() => {
        doOCR();
    }, [imgUpload]);

    const handleTakePhoto = data => {
        var uploads = [];
        uploads.push(data);
        setImgToText('Translating to text...');
        setImgUpload(uploads);
    }

    const imageUpload = event => {
        if (event.target.files[0]) {
        var uploads = []
        for (var key in event.target.files) {
            if (!event.target.files.hasOwnProperty(key)) continue;
            let upload = event.target.files[key]
            uploads.push(URL.createObjectURL(upload))
        }
            setImgToText('Translating to text...');
            setImgUpload(uploads);
        } else {
            setImgToText('');
            setImgUpload([]);
        }
    }

    return (
        <div>
        <Dialog fullScreen open={props.show} onClose={props.close} TransitionComponent={Transition.SlideUpDialog}>
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.dialogTitle}>
                        Add Notes
                    </Typography>
                    <IconButton color="inherit" onClick={() => onSubmit(handleSubmit)}>
                        <SaveIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <form>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Title</InputLabel>
                            <Input type="text" name="title" disableUnderline={true}/>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <FormControl>
                            <InputLabel>Content</InputLabel>
                            <Input type="text" name="content" value={imgToText} multiline disableUnderline={true} />
                        </FormControl>
                    </FormGroup>
                </form>
            </DialogContent>
            <Camera onTakePhoto={ data => handleTakePhoto(data)} />
            <input type="file" onChange={e => imageUpload(e)} ref={fileInput} hidden/>
            <BottomNavigation color="primary" showLabels>
                <BottomNavigationAction icon={<ImageIcon />} onClick={() => fileInput.current.click()} />
                <BottomNavigationAction icon={<PhotoCameraIcon />} />
                <BottomNavigationAction icon={<MicIcon />} />
                <BottomNavigationAction icon={<BrushIcon />} />
            </BottomNavigation>
        </Dialog>
    </div>
    )
}

export default withStyles(style)(CreateNotes);