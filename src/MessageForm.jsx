import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";

const emailRegex = RegExp(
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
);

const formValid = ({ formErrors, message, ...rest }) => {
  let valid = true;

  // validate form errors being empty
  Object.values(formErrors).forEach((val) => {
    val.length > 0 && (valid = false);
  });

  // validate the form was filled out
  Object.values(rest).forEach((val) => {
    val.length === 0 && (valid = false);
  });

  return valid;
};

export default class MessageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
      formErrors: {
        firstName: "",
        lastName: "",
        email: "",
      },
    };
  }

  handleSend = (event) => {
    event.preventDefault();

    if (formValid(this.state)) {
      //submit api request to aws
      var params = JSON.stringify({
        operation: "create",
        subject: this.state.firstName + this.state.lastName,
        email: this.state.email,
        message: this.state.message,
      });
      //send request to aws
      console.log(params);
    } else {
      alert("Please fill out and validate the require fields.");
    }
  };

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let formErrors = { ...this.state.formErrors };

    switch (name) {
      case "firstName":
        formErrors.firstName =
          value.length < 2 ? "Minimum 2 characaters required" : "";
        break;
      case "lastName":
        formErrors.lastName =
          value.length < 2 ? "Minimum 2 characaters required" : "";
        break;
      case "email":
        formErrors.email = emailRegex.test(value)
          ? ""
          : "invalid email address";
        break;
      default:
        break;
    }

    this.setState({ formErrors, [name]: value });
  };

  render() {
    const { firstName, lastName, email, message, formErrors } = this.state;

    return (
      <form onSubmit={this.handleSend} noValidate>
        <React.Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="firstName"
                name="firstName"
                label="First name"
                fullWidth
                autoComplete="given-name"
                helperText={this.state.formErrors.firstName}
                error={formErrors.firstName.length > 0 ? true : false}
                onChange={(event) => this.handleChange(event)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="lastName"
                name="lastName"
                label="Last name"
                fullWidth
                autoComplete="family-name"
                helperText={this.state.formErrors.lastName}
                error={formErrors.lastName.length > 0 ? true : false}
                onChange={(event) => this.handleChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                id="email"
                name="email"
                label="Email"
                fullWidth
                autoComplete="email"
                helperText={this.state.formErrors.email}
                error={formErrors.email.length > 0 ? true : false}
                onChange={(event) => this.handleChange(event)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="message"
                name="message"
                label="Message"
                fullWidth
                variant="outlined"
                multiline
                rows={10}
                onChange={(event) => this.handleChange(event)}
              />
            </Grid>
            <Grid>
              <Button onClick={(event) => this.handleSend(event)}>Send</Button>
            </Grid>
          </Grid>
        </React.Fragment>
      </form>
    );
  }
}
