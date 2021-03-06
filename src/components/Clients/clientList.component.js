import React, { Component } from "react";
import { observer } from "mobx-react";
import { Button, Input, List, Header, Divider } from "semantic-ui-react";
import axios from "axios";
import ClientsStore from "../../stores/ClientsStore";
import AppStore from "../../stores/AppStore";
import authStore from "../../stores/AuthStore";

const ClientListComponent = observer(
  class ClientListComponent extends Component {
    constructor(props) {
      super(props);
      ClientsStore.getClientsList();
      this.addClient = this.addClient.bind(this);
    }

    getRenderedClientsList(clientName) {
      return (
        <List.Item key={clientName}>
          <List.Icon name="user" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header as="a">{clientName}</List.Header>
            <List.Description as="a">Project Description</List.Description>
          </List.Content>
        </List.Item>
      );
    }

    async addClient() {
      if (ClientsStore.newClientsInput) {
        await axios
          .post(
            AppStore.URL + "/clients/",
            {
              name: ClientsStore.newClientsInput
            },
            {
              headers: {
                Authorization: "Bearer " + authStore.token,
                "Content-Type": "application/json"
                
              }
            }
          )
          .then(function(response) {
            ClientsStore.getClientsList();
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      ClientsStore.newClientsInput = "";
    }

    handleMessage(e) {
      ClientsStore.newClientsInput = e.target.value;
    }

    render() {
      return (
          <div className="ui container aligned">
           <Header as="h3" icon="user" content="CLIENTS LIST" />
            <Divider />
            <Input
              onChange={this.handleMessage.bind(this)}
              action={<Button onClick={() => this.addClient()}>ADD</Button>}
              placeholder="Add a new client..."
              value={ClientsStore.newClientsInput}
            />
            <List divided relaxed>
              {ClientsStore.clients.map(client =>
                this.getRenderedClientsList(client.name)
              )}
            </List>
          </div>

      );
    }
  }
);

export default ClientListComponent;
