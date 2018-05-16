import React, {Component} from 'react';
import DropzoneComponent from 'react-dropzone-component';
import './dropzone.css'
import '../../../node_modules/react-dropzone-component/styles/filepicker.css'
import '../../../node_modules/dropzone/dist/min/dropzone.min.css'
import toastr from 'toastr'
import '../../index.css'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import {
  Grid, Row, Col, HelpBlock,
  FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';

import {Card} from 'components/Card/Card.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';


class Upload extends Component {

  constructor(props) {
    super(props);

    this.componentConfig = {
     addRemoveLinks: true,
     iconFiletypes: ['.jpg', '.png', '.gif','.pdf','.docx'],
     showFiletypeIcon: true,
     postUrl: 'http://localhost:9000/upload'
  };

    this.dropzone = null;
    this.eventHandlers = { init: (dz) => this.dropzone = dz,
                            drop: this.drop.bind(this),
                            addedfile: this.fileAdded.bind(this),
                            success: this.success.bind(this),
                            complete: this.complete.bind(this),
                            sending: this.sending.bind(this),
                            uploadprogress: this.uploadprogress.bind(this),
                            queuecomplete: this.queuecomplete.bind(this)};

    this.handleAssetTitleChange = this.handleAssetTitleChange.bind(this);
    this.getValidationStateAssetTitle = this.getValidationStateAssetTitle.bind(this);
    this.getValidationStateDescr = this.getValidationStateDescr.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.onCopy = this.onCopy.bind(this)
    this.handleEncryptionKeyChange = this.handleEncryptionKeyChange.bind(this);

    this.state = {
        assetTitle: '',
        description: '',
        djsConfig : { autoProcessQueue: false },
        txIdVal: '',
        copied: false,
        txId: '',
        encryptionKey: ''
    }
 }

 handleAssetTitleChange(e) {
    let assetTitle = e.target.value;
    this.setState({
        assetTitle: assetTitle
    })
}

getValidationStateAssetTitle() {
    const length = this.state.assetTitle.length;
    if (length >=1 && length <= 64) return 'success';
    else if (length > 10) return 'error';
    return null;
}

getValidationStateDescr() {
    const length = this.state.description.length;
    if (length >=1 && length <= 64) return 'success';
    else if (length > 10) return 'error';
    return null;
}

handleDescriptionChange(e) {
    let description = e.target.value;
    this.setState({
        description: description
    })
}

handleEncryptionKeyChange(e) {
    let encryptionKey = e.target.value;
    this.setState({
        encryptionKey: encryptionKey
    })  
}

 drop(file) {
    console.log('File just dropped into the zone!')
 }

 fileAdded(file) {
    console.log('added file',file); 
 }

 success(file) {
    console.log('Files(s) successfully uploaded', file);
 }

 complete(file) {
    console.log('Files(s) successfully completed', file);
    const serverResponce = file.xhr;
    if (serverResponce) {
        if (serverResponce.status === 200 && 
            serverResponce.readyState === 4 && 
            serverResponce.statusText === "OK" &&
            JSON.parse(serverResponce.responseText).asset) {
                console.log(JSON.parse(serverResponce.responseText))
                let obj = JSON.parse(serverResponce.responseText)
                const txId = obj.asset.id;
                this.setState({
                    txId: txId
                });
                toastr.success("Upload successful")
        }
    }
 }

 sending(file) {
    console.log('Files(s) successfully sent', file);
 }

 uploadprogress(file) {
    console.log('uploadprogress',file); 
 }

 queuecomplete(file) {
    console.log('queuecomplete',file); 
 }

 handlePost(e) {
    e.preventDefault();
    console.log(this.state.djsConfig)
    this.dropzone.processQueue();
 }

 onCopy() {
    this.setState({copied: true});
 };

  render() {

    const componentConfig = this.componentConfig;
    let djsConfig = this.state.djsConfig;
    djsConfig.params = {assetTitle: this.state.assetTitle, 
                        description: this.state.description,
                        encryptionKey: this.state.encryptionKey}
    const eventHandlers = this.eventHandlers;
    
    return (    
    <div>
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Document Metadata"
                                content={
                                    <form>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formControlsAssetTitle" 
                                                validationState={this.getValidationStateAssetTitle()}>
                                                    <ControlLabel>Asset Title</ControlLabel>
                                                    <FormControl rows="5" 
                                                                 componentClass="input"
                                                                 type="text"
                                                                 bsClass="form-control" 
                                                                 placeholder="Here type your asset title" 
                                                                 defaultValue=""
                                                                 onChange={this.handleAssetTitleChange}
                                                                />
                                                    <HelpBlock>asset title</HelpBlock>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formControlsDescription"
                                                validationState={this.getValidationStateDescr()}>
                                                    <ControlLabel>Asset Description</ControlLabel>
                                                    <FormControl rows="5" 
                                                                 componentClass="textarea" 
                                                                 bsClass="form-control" 
                                                                 placeholder="Here can be your description" 
                                                                 defaultValue=""
                                                                 onChange={this.handleDescriptionChange}/>
                                                    <HelpBlock>asset description</HelpBlock>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formControlsAssetTitle">
                                                    <ControlLabel>Encryption Key</ControlLabel>
                                                    <FormControl rows="5" 
                                                                 componentClass="input"
                                                                 type="password"
                                                                 bsClass="form-control" 
                                                                 placeholder="Secret 123" 
                                                                 defaultValue=""
                                                                 onChange={this.handleEncryptionKeyChange}
                                                                />
                                                    <HelpBlock>encryption key</HelpBlock>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        
                                        <Row>
                                            <Col md={12}>
                                            <DropzoneComponent config={componentConfig}
                                              eventHandlers = {eventHandlers}
                                              djsConfig={djsConfig}
                                              />
                                            </Col>
                                        </Row>

                                        <Button
                                            bsStyle="info"
                                            block
                                            fill
                                            type="submit"
                                            onClick={this.handlePost.bind(this)}
                                          >
                                            Upload
                                        </Button>

                                        <br />
                                        <Row className="show-grid">
                                            <Col md={8} xs={12}>
                                                <FormGroup controlId="formControlsAssetTitle">
                                                    <ControlLabel>Transaction Id</ControlLabel>
                                                    <FormControl rows={1}
                                                                componentClass="input"
                                                                type="text"
                                                                bsClass="form-control" 
                                                                placeholder="" 
                                                                disabled
                                                                onChange={this.handleAssetTitleChange}
                                                                value={this.state.txId}
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4} xs={12}>
                                                <CopyToClipboard
                                                    onCopy={this.onCopy}
                                                    options={{message: 'Copied to clipboard!'}}
                                                    text={this.state.txId}>
                                                    <Button bsStyle="success" onClick={(e)=>{e.preventDefault()}}>Copy to clipboard</Button>
                                                </CopyToClipboard>
                                                {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                                            </Col>
                                            <Col md={1} xs={12}>
                                            
                                                
                                            
                                            </Col>
                                        </Row>

                                    </form>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>>
            </div>
    </div>
    );

  }
  
}

export default Upload;