import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios';
import Moment from 'react-moment';
import 'moment-timezone';

let getHtmlMarkup = (text, start, end)=> {
    if (start === 0 && end === 0) {
        return text;
    }
    let keyword = text.substr(start, end - start);
    let first = text.substr(0, start);
    let last = text.substr(end, text.length - first.length - keyword.length);

    return first + '<span class="full-highlighting">' + keyword + '</span>' + last;
};


class EntityFrame extends Component {

    constructor(props) {
        super(props);
        this.showDocument = this.showDocument.bind(this);
        this.toggle = this.toggle.bind(this);
        this.url = props.url;
        this.state = {
            report_modal: false,
            report_text: "",
            report_id: ""
        };

    }

    toggle() {
        this.setState({
            report_modal: !this.state.report_modal
        });
    }

    showDocument(data) {
        console.log(data);
        let get_url = this.url + 'document/' + data['report_id'];
        axios.get(get_url).then(response => {
            console.log(response.data);
            this.setState(
                {
                    'report_text': response.data.report_text,
                    'report_modal': !this.state.report_modal,
                    'report_id': data['report_id']
                }
            )
        });
    }

    render() {
        let {data} = this.props;
        let detail = data['detail'];
        let start = detail['start'] || 0;
        let end = detail['end'] || 0;
        let text = data['text'];
        let html = {
            '__html': getHtmlMarkup(text, start, end)
        };

        return (
            <div key={data['id']} className="EntityFrame"  >
                <div onClick={() => this.showDocument(data)}>
                    <div>
                        <span className="h5">
                            {this.props.nlpql_feature === data['feature'] ? <span>{" "}</span> :
                            <span onClick={() => this.props.showPhenotypeTypDetail(data["feature"])}>{data["feature"]}</span>}

                            <small className="float-sm-right"><Moment format="MMM D, YYYY h:mm a">
                                {data["report_date"]}</Moment></small>
                        </span>
                    </div>
                    <p className="EntitySentence" dangerouslySetInnerHTML={html}/>
                </div>
                <Modal isOpen={this.state.report_modal} toggle={this.toggle} className="ReportModal">
                    <ModalHeader toggle={this.toggle}>{"Report #" + this.state.report_id}</ModalHeader>
                    <ModalBody>
                        <pre>{this.state.report_text}</pre>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default EntityFrame;