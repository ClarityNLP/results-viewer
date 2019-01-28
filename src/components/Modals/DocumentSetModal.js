/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React from "react";
import {
  Button,
  Collapse,
  Form,
  FormGroup,
  Label,
  Input,
  CardHeader,
  CardBody
} from "reactstrap";
import plus_icon from "../../assets/img/icon--plus.png";

class DocumentSetModal extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      collapse: false,
      name: "",
      reportTypes: "",
      reportTags: "",
      sources: "",
      filterQuery: "",
      query: ""
    };
  }

  toggle = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };

  buildArrayStringWithQuotes = s => {
    let arr = s.split(",");

    let tmp = "[";
    for (let i = 0; i < arr.length; i++) {
      tmp += '"' + arr[i].trim() + '"';
      if (i < arr.length - 1) {
        tmp += ", ";
      }
    }
    tmp += "]";

    return tmp;
  };

  handleInputChange = event => {
    const target = event.target;
    const options = event.target.options;
    let value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (options) {
      value = [];
      for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
          value.push(options[i].value);
        }
      }

      value = value.toString();
    }

    this.setState({
      [name]: value
    });
  };

  handleSubmit = event => {
    event.preventDefault();

    const {
      name,
      reportTypes,
      reportTags,
      sources,
      filterQuery,
      query
    } = this.state;

    let hasTypes = reportTypes.length > 0 && reportTypes[0].length > 0;
    let hasTags = reportTags.length > 0 && reportTags[0].length > 0;
    let hasSource = sources.length > 0 && sources[0].length > 0;
    let hasFilterQuery = filterQuery.length > 0;
    let hasQuery = query.length > 0;

    let text = "documentset " + name + ":\n\t";

    if (hasTypes && !hasTags && !hasSource && !hasFilterQuery && !hasQuery) {
      text +=
        "Clarity.createReportTypeList(" +
        this.buildArrayStringWithQuotes(reportTypes) +
        ");\n\n";
    } else if (
      hasTags &&
      !hasTypes &&
      !hasSource &&
      !hasFilterQuery &&
      !hasQuery
    ) {
      text +=
        "Clarity.createReportTagList(" +
        this.buildArrayStringWithQuotes(reportTags) +
        ");\n\n";
    } else {
      let payloadKeys = [];

      if (hasTypes) {
        payloadKeys.push(
          "report_types: " + this.buildArrayStringWithQuotes(reportTypes)
        );
      }

      if (hasTags) {
        payloadKeys.push(
          "report_tags: " + this.buildArrayStringWithQuotes(reportTags)
        );
      }

      if (hasSource) {
        payloadKeys.push("source: " + this.buildArrayStringWithQuotes(sources));
      }

      if (hasFilterQuery) {
        payloadKeys.push(
          "filter_query: " + '"' + filterQuery.replace(/"/g, "'") + '"'
        );
      }

      if (hasQuery) {
        payloadKeys.push('query: "' + query.replace(/"/g, "'") + '"');
      }

      let payload = "{\n\t\t";
      for (let i = 0; i < payloadKeys.length; i++) {
        payload += payloadKeys[i];
        if (i < payloadKeys.length - 1) {
          payload += ",\n\t\t";
        }
      }
      payload += "\n\t}";

      text += "Clarity.createDocumentSet(" + payload + ");\n\n";
    }

    this.props.appendDocumentSet(name);
    this.props.updateNLPQL(text);
    this.toggle();
  };

  render() {
    const {
      collapse,
      name,
      sources,
      query,
      reportTypes,
      reportTags,
      filterQuery
    } = this.state;

    return (
      <div>
        <CardHeader onClick={this.toggle}>
          <img src={plus_icon} className="mr-2" /> Document Set
        </CardHeader>
        <Collapse isOpen={collapse}>
          <CardBody>
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="sources">Data Source</Label>
                <Input
                  type="text"
                  id="sources"
                  name="sources"
                  value={sources}
                  onChange={this.handleInputChange}
                  placeholder="Enter comma separated terms."
                />
              </FormGroup>

              <FormGroup>
                <Label for="query">Query</Label>
                <Input
                  type="text"
                  id="query"
                  name="query"
                  value={query}
                  onChange={this.handleInputChange}
                />
              </FormGroup>

              <div id="documentsetList">
                <FormGroup>
                  <Label for="reportTypes">Report Types</Label>
                  <Input
                    type="text"
                    id="reportTypes"
                    name="reportTypes"
                    value={reportTypes}
                    onChange={this.handleInputChange}
                    placeholder="Enter comma separated terms."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="reportTags">Report Tags</Label>
                  <Input
                    type="text"
                    id="reportTags"
                    name="reportTags"
                    value={reportTags}
                    onChange={this.handleInputChange}
                    placeholder="Enter comma separated terms."
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="filterQuery">Filter Query</Label>
                  <Input
                    type="text"
                    id="filterQuery"
                    name="filterQuery"
                    value={filterQuery}
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </div>

              <Button
                color="success"
                type="submit"
                id="submit"
                onClick={this.handleSubmit}
              >
                Save changes
              </Button>
            </Form>
          </CardBody>
        </Collapse>
      </div>
    );
  }
}

export default DocumentSetModal;
