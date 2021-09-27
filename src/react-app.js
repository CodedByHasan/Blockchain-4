'use strict';

{/* Form for uploading documents to be anchored */}
class AnchorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileName: '',
      uploadedFile: null,
    };
    this.handleChange = this.HandleChange.bind(this);
    this.handleSubmit = this.HandleSubmit.bind(this);
    this.fileInput = React.createRef();
  }

  HandleChange(event) { this.setState({fileName: event.target.value}); }

  HandleSubmit(event) {
    alert('A file was submitted: ' + this.state.fileName);
    event.preventDefault();
    this.setState({uploadedFile: this.fileInput.current.files[0]});
    console.log(this.fileInput.current.files[0]);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.fileName} onChange={this.handleChange} />
          <input type="file" ref={this.fileInput} />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
  }
}

{/* Default rendered component, allows a user to upload a document either for
validation against an existing anchored document, or to anchor new document */}
class AnchorValidate  extends React.Component
{
  render()
  {
    return (
      <div>
        <div className="anchor">
          <h1>Anchor</h1>
          {/* Placeholder text */}
          <p>Upload a document here to save it for future validations.</p>
          <AnchorForm />
        </div>

        <div className="validate">
          <h1>Validate</h1>
          {/* Placeholder text */}
          <p>Upload a document here to validate it.</p>
          {/* Requires JS for upload functionality */}
        </div>
      </div>
    );
  }
}

{/* Renders on page if an uploaded document was succesfully anchored */}
class AnchorSuccess extends React.Component
{
  render()
  {
    return (
      <div className="anchorSuccess">
        <h1>Upload Successful</h1>
        <p>
          Your document has been successfully uploaded, future attempts to
          validate this file will be successful.
        </p>
      </div>
    );
  }
}

{/* Renders on page if an uploaded document could not be anchored */}
class AnchorFailure extends React.Component
{
  render()
  {
    return (
      <div className="anchorFailure">
        <h1>Upload Failed</h1>
        <p>
          Your document could not be uploaded, contact your system administrator.
        </p>
      </div>
    );
  }
}

{/* Renders on page if uploaded document was succesfully validated */}
class ValidateSuccess extends React.Component
{
  render()
  {
    return (
      <div className="validateSuccess">
        <h1>Document is Valid</h1>
        <p>Your document is valid</p>
      </div>
    );
  }
}

{/* Renders on page if the uploaded document could not be validated */}
class ValidateFailure extends React.Component
{
  render()
  {
    return (
      <div className="validateFailure">
        <h1>Document is Invalid</h1>
        <p>
          Sorry, we couldn't validate your document. Your file may never have
          been uploaded to the validation system, or may be a doctored form of the
          true document
        </p>
      </div>
    );
  }
}

{/* A component which explains how the document anchoring system works */}
class TechnologyExplanation extends React.Component
{
  render()
  {
    return (
      <div className="technologyExplanation">
        <h1>How it works</h1>
        <p>
          This validation system utilises the Hedera Hasgraph blockchain to
          validate documents, allowing users to be sure that their file is the
          true, undoctored form of the document.
        </p>
        <p>
          Upon a document being uploaded, the system stores the document and
          generates a [Hash technology] hash from it. It then uses Hedera
          APIs to anchor this hash on the blockchain. In the future, when the same
          file is uploaded to the validation section, the system generates a
          hash again, and checks if this same hash exists on the blockchain. If
          so, the document is valid. If not, the file has either not been
          uploaded to the system before, or the document is invalid.
        </p>
      </div>
    );
  }
}

{/* Main component which renders the correct sub-component based on its state */}
class Main extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state =
    {
      display: "anchor-validate",
    }
  }

  render()
  {
    // Check the state to determine which div to render
    switch(this.state.display)
    {
      case "anchorSuccess":
        return (
          <div>
            <AnchorSuccess />
            <TechnologyExplanation />
          </div>
        );
        break;
      case "anchorFailure":
        return (
          <div>
            <AnchorFailure />
            <TechnologyExplanation />
          </div>
        );
        break;
      case "validateSuccess":
        return (
          <div>
            <ValidateSuccess />
            <TechnologyExplanation />
          </div>);
        break;
      case "validateFailure":
        return (
          <div>
            <ValidateFailure />
            <TechnologyExplanation />
          </div>
        );
        break;
      //  Default state is displaying a validate and anchor div side by side
      default:
        return (
          <div>
            <AnchorValidate />
            <TechnologyExplanation />
          </div>);
        break;
    }
  }
}

let domContainer = document.querySelector('#root');
ReactDOM.render(<Main />, domContainer);
