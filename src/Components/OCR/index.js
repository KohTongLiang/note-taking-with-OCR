import React, { useEffect, useState } from 'react';
import { createWorker} from 'tesseract.js';
import { Container, Button, Typography, Box  } from '@material-ui/core';

const worker = createWorker();

function OCR(props) {
  const [ocr, setOcr] = useState('Recognizing...');
  const [uploads, setUploads] = useState([]);

  const doOCR = async () => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(uploads[0]);
    setOcr(text);
  };

  useEffect(() => {
    doOCR();
  }, [uploads]);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      var u = []
      for (var key in event.target.files) {
        if (!event.target.files.hasOwnProperty(key)) continue;
        let upload = event.target.files[key]
        u.push(URL.createObjectURL(upload))
      }1
      setUploads(u);
    } else {
      setUploads([]);
    }
  }

  return (
    <Box>
    <Container>
        {/* <input type="file" id="fileUploader" onChange={handleChange} multiple /> */}
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            style={{ display: "none" }}
            id="fileUploader" onChange={handleChange} multiple
          />
        </Button>

        <Typography variant="body1">
          { uploads.map((value, index) => {
            return <img key={index} src={value} width="100px" />
          }) }
        </Typography>

      <p>{ocr}</p>
    </Container>
    </Box>
  );
}

export default OCR;
