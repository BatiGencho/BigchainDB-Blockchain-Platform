import React, { Component } from 'react';
import {
    Grid, Row, Col, HelpBlock, Table, Modal,
    FormGroup, ControlLabel, FormControl
} from 'react-bootstrap';
import toastr from 'toastr'
import $ from 'jquery'
import { Link } from 'react-router-dom'
import {Card} from 'components/Card/Card.jsx';
import {FormInputs} from 'components/FormInputs/FormInputs.jsx';
import Button from 'elements/CustomButton/CustomButton.jsx';
import '../../index.css'

const thArray = ["ID","Operation","Metadata","Outputs","URL"];
const imageTypes = /image.*/;
const applicationTypes = /application.*/;

class AssetsForm extends Component {

    constructor(props, context) {
        super(props, context);

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleassetIdChange = this.handleassetIdChange.bind(this);
        this.getValidationStateDescr = this.getValidationStateDescr.bind(this);
        this.getValidationStateAssetId = this.getValidationStateAssetId.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.clickedOnLink = this.clickedOnLink.bind(this);
        this.handleEncryptionKeyChange = this.handleEncryptionKeyChange.bind(this);
        this.sendDownloadRequest = this.sendDownloadRequest.bind(this)

        this.state = {
            assetId: '',
            description: '',
            assetTableData: [[]],
            modalShow: false,
            encryptionKey: ''
        }
    }

    handleFormSubmit(e) {
        
        e.preventDefault();

        if (this.state.assetId.length == 0) return;

        let data = {
            assetId: this.state.assetId.trim(),
            description: this.state.description.trim(),
        };

        let request = {
            url: 'http://localhost:9000/searchAssetById',
            method: 'POST',
            data: data,
            async: true,
            dataType: 'json'
        };
        console.log('Requested Data: ' + JSON.stringify(request))
        $.ajax(request)
            .done((res) => {
                if (res.asset) {
                    this.setState({
                        assetTableData : [[ res.asset.id , 
                                            res.asset.operation, 
                                            JSON.stringify(res.asset.metadata),
                                            res.asset.outputs.length,
                                            <Link to={``} onClick={this.clickedOnLink}>download</Link>]]
                    })
                } else {
                    toastr.error("No entries found")
                }              
            })
            .fail((err) => {
                toastr.error("No entries found")
                console.log('tx post fail.' + JSON.stringify(err)) 
            });
    }

    handleassetIdChange(e) {
        let assetId = e.target.value;
        this.setState({
            assetId: assetId
        })
    }

    handleEncryptionKeyChange(e) {
        let encryptionKey = e.target.value;
        this.setState({
            encryptionKey: encryptionKey
        })
    }

    handleDescriptionChange(e) {
        let description = e.target.value;
        this.setState({
            description: description
        })
    }

    getValidationStateAssetId() {
        const length = this.state.assetId.length;
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

    handleModalClose() {
        this.setState({ 
            modalShow: false 
        });
    }

    clickedOnLink(e) {
        e.preventDefault()
        this.setState({
            modalShow: true
        })
    }

    sendDownloadRequest(e) {
        e.preventDefault()
        let self = this;

        if (this.state.encryptionKey.length == 0) {
            toastr.error('Passport must have more than 0 characters')
            return;
        }

        let data = {
            encryptionKey: this.state.encryptionKey.trim(),
            assetId: this.state.assetId.trim()
        };

        let request = {
            url: 'http://localhost:9000/download',
            method: 'POST',
            data: data,
            async: true,
            dataType: 'json'
        };
        $.ajax(request)
            .done((binaryObj) => {
                if (binaryObj) {
                    
                    console.log(binaryObj.decryptedFile.buffer.data)
                    console.log('received binary data',binaryObj.decryptedFile.buffer.data);
                    let base64 = btoa(binaryObj.decryptedFile.buffer.data)
                    console.log('base64 encoded',base64);
                    var blob = new Blob([binaryObj.decryptedFile.buffer.data], { type: binaryObj.decryptedFile.mimetype });
                    console.log('data as BLOB',base64);

                    if (binaryObj.decryptedFile.mimetype.match(imageTypes)) { //an image file

                        //----USE THE BASE64 URL-----
                        //var downloadUrl = URL.createObjectURL(blob);
                        //console.log(downloadUrl)
                        //window.open("data:image/jpeg;base64," + (base64));

                        //----USE A FILEREADER-----
                        let fileReader = new FileReader();
                        fileReader.readAsDataURL(blob);
                        fileReader.addEventListener("load", function () {
                            console.log('File reader res',fileReader.result)
                            //image.src = fileReader.result;
                        }, false);

                    } else if (binaryObj.decryptedFile.mimetype.match(applicationTypes)) {
                        //do proper decoding for (docx, pdf. ......)
                    }
                } else {
                    toastr.error("Faulty data received")
                }              
            })
            .fail((err) => {
                toastr.error("Faulty data received")
                console.log('tx post fail.' + JSON.stringify(err)) 
            });

        this.setState({ 
            modalShow: false 
        });
    }

    render() {
        return (
            <div className="content">
                <Grid fluid>
                    <Row>
                        <Col md={8}>
                            <Card
                                title="Search for Assets"
                                content={
                                    <form onSubmit={  this.handleFormSubmit.bind(this) }>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup controlId="formControlsassetId" 
                                                validationState={this.getValidationStateAssetId()}>
                                                    <ControlLabel>Transaction Id</ControlLabel>
                                                    <FormControl rows="5" 
                                                                 componentClass="input"
                                                                 type="text"
                                                                 bsClass="form-control" 
                                                                 placeholder="Here type your tx id" 
                                                                 defaultValue=""
                                                                 onChange={this.handleassetIdChange}
                                                                />
                                                    <HelpBlock>asset tx id</HelpBlock>
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
                                                                 componentClass="input"
                                                                 type="text"
                                                                 bsClass="form-control" 
                                                                 placeholder="Here type your description" 
                                                                 defaultValue=""
                                                                 onChange={this.handleDescriptionChange}
                                                                />
                                                    <HelpBlock>asset description</HelpBlock>
                                                    <FormControl.Feedback />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="submit"
                                        >
                                            Search
                                        </Button>
                                        <div className="clearfix"></div>
                                    </form>
                                }
                            />
                        </Col>

                        <Col md={12}>
                            <Card
                                title="Found assets"
                                category="BigChain DB Assets"
                                ctTableFullWidth ctTableResponsive
                                content={
                                    <Table striped hover>
                                        <thead>
                                            <tr>
                                                {
                                                    thArray.map((prop, key) => {
                                                        return (
                                                        <th  key={key}>{prop}</th>
                                                        );
                                                    })
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.assetTableData.map((prop,key) => {
                                                    return (
                                                        <tr key={key}>{
                                                            prop.map((prop,key)=> {
                                                                return (
                                                                    <td  key={key}>{prop}</td>
                                                                );
                                                            })
                                                        }</tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                }
                            />
                        </Col>
                    </Row>
                </Grid>>

                {/* Modal */}
                <Modal  show={this.state.modalShow} 
                        onHide={this.handleModalClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Enter Encryption Key</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                        <Row>
                            <Col md={12}>
                                <FormGroup controlId="formControlsassetId">
                                <ControlLabel>Encryption Key</ControlLabel>
                                <FormControl rows="5" 
                                    componentClass="input"
                                    type="password"
                                    bsClass="form-control" 
                                    placeholder="Secret 123" 
                                    defaultValue=""
                                    onChange={this.handleEncryptionKeyChange}
                                />
                                <FormControl.Feedback />
                                </FormGroup>
                            </Col>
                        </Row>
                        </Modal.Body>
                    <Modal.Footer>
                    <Button bsStyle="success" onClick={this.sendDownloadRequest}>Download</Button>
                    <Button onClick={this.handleModalClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default AssetsForm;
