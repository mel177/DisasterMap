import React, { Component } from "react";
import API from "../../utils/API";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper, Grid, Typography, TextField, Button, Checkbox, List, ListItemText, ListItemSecondaryAction, ListItem, IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';
import SimpleModal from '../../components/SimpleModal';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    minHeight: '100vh'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '80%',
  },
  button: {
    margin: theme.spacing.unit * 2,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit * 2,
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  slashedText: {
    textDecoration: "line-through"
  },
  containerScroll: {
    overflow: 'auto',
    height: '100%',
  },
  icons: {
    padding: '10px',
    zIndex: '101'
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  toolbar: theme.mixins.toolbar,
});


class Homelists extends Component {
  state = {
    items: [],
    item: "",
    editItem: "",
    editItemId: "",
    modal: false,
  };

  componentDidMount() {
    this.loadHomelists();
  }

  loadHomelists = () => {
    API.getAllHomelists()
      .then(res => this.setState({ items: res.data, item: "" }))
      .catch(err => console.log(err));
  };

  deleteHomelists = id => {
    API.deletehomelists(id)
      .then(res => this.loadHomelists())
      .catch(err => console.log(err));
  };

  updateItem = () => {
    if (this.state.editItem) {
      API.updatehomelists(this.state.editItemId, { item: this.state.editItem })
        .then(res => this.loadEvacuationlists())
        .catch(err => console.log(err));
    }
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.item) {
      API.savehomelists({ item: this.state.item })
        .then(res => this.loadHomelists())
        .catch(err => console.log(err));
    }
  };

  handleCheckChange = (event, id) => {
    let item = this.state.items.filter(x => x._id === id)
    item[0].checked = event.target.checked
    API.updatehomelists(id, item[0])
      .then(res => this.loadHomelists())
      .catch(err => console.log(err));
  }

  handleOpenModal = (id) => {
    let editItem = this.state.items.filter(x => x._id === id)[0].item
    this.setState({ modal: true, editItem, editItemId: id });
  };

  handleCloseModal = () => {
    this.setState({ modal: false, editItem: "", editItemId: "" });
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container spacing={0} className={classes.containerScroll}>
          <Grid item xs={12} md={12}>
            <Grid
              container
              spacing={0}
              justify="center"
            >
              <Grid item xs={12} md={10}>
                <Paper className={classes.paper}>
                  <Typography variant="h6" align="center">
                    Home Kit
          </Typography>
                  <Typography variant="body1">
                    Keep a Stay-at-Home Kit for when you need to shelter at home for an extended period.
          </Typography>

                  <List>
                    {
                      this.state.items.length ?
                        this.state.items.map((item, index) => (
                          <ListItem
                            key={index}
                            dense
                            className={classes.listItem}
                          >
                            <ListItemText primary={item.item} className={item.checked && classes.slashedText} />
                            <Checkbox
                              className={classes.icons}
                              checked={item.checked}
                              tabIndex={-1}
                              // disabled={item.checked}
                              disableRipple
                              onChange={(event) => this.handleCheckChange(event, item._id)}
                            />
                            {
                              // !item.checked ? 
                              (<ListItemSecondaryAction >
                                <IconButton aria-label="Edit" title="Edit">
                                  <Edit onClick={() => this.handleOpenModal(item._id)} />
                                </IconButton>
                                <IconButton aria-label="Delete" title="Delete">
                                  <Delete onClick={() => this.deleteHomelists(item._id)} />
                                </IconButton>
                              </ListItemSecondaryAction>)
                              // : null
                            }
                          </ListItem>
                        )) : <Typography variant="h6" align="center">
                          You don't have an home kit yet! Start creating one!
            </Typography>
                    }
                  </List>
                  <form>
                    <TextField
                      id="item"
                      type="text"
                      name="item"
                      label="Item"
                      className={classes.textField}
                      margin="normal"
                      required
                      autoFocus
                      value={this.state.item}
                      onChange={this.handleInputChange}
                      helperText="List any other additional items that your family might need"
                    />
                    <Button size="medium" type="submit" variant="contained" color="primary" className={classes.button} onClick={this.handleFormSubmit}>
                      SUBMIT
                  </Button>
                  </form>
                  {
                    this.state.modal ? (
                      <SimpleModal
                        ariaLabel="Edit"
                        ariaDescription="Edit current item"
                        open={this.state.modal}
                        onClose={this.handleCloseModal}
                      >
                        <Typography variant="h6">
                          Edit
                    </Typography>
                        <form className={classes.container}>
                          <TextField
                            id="editItem"
                            label="Item"
                            name="editItem"
                            type="text"
                            className={classes.textField}
                            value={this.state.editItem}
                            onChange={this.handleInputChange}
                            margin="normal"
                          />
                          <Button type="submit" variant="contained" color="primary" className={classes.button} onClick={this.updateItem}>
                            Save
                      </Button>
                        </form>
                      </SimpleModal>) : null
                  }
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </main>
    );
  }
}

Homelists.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Homelists)
