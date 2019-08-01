import React, { Component } from "react";
import "../css/bootstrap.css";
import "../css/Botoes.css";
import "../css/Setores.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../APIs/DataApi";

export class Unidades extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaSetores: []
    };
  }

  componentDidMount() {
    api("http://localhost:5000/api/Setores", {})
      .then(response => response.json())
      .then(data => this.setState({ listaSetores: data.setores }));
  }

  handleDesativarUnidade = () => {
    this.props.obj.delete(this.props.id);
  };

  render() {
    return (
      <div className="unidades" idSetor={this.props.id}>
        <div className="headUni">
          <span className="ttl">{this.props.text}</span>
        </div>
        <div className="bodyUni">
          {/* <Button variant="outline-success"
                        onClick={() => this.props.openShowModal("addUnidade", this.state)}
                    >
                        <FontAwesomeIcon icon="plus-circle" />
                        Adicionar
                    </Button>
                    <Button variant="outline-danger"
                        onClick={() => this.handleDesativarUnidade(this.state.idSetor)}
                    >
                        <FontAwesomeIcon icon="minus-circle" />
                        Desativar
                    </Button> */}
          <Button
            variant="success"
            size="sm"
            onClick={() => this.props.obj.add(this.props.obj)}
          >
            <FontAwesomeIcon icon="plus-circle" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={this.handleDesativarUnidade}
          >
            <FontAwesomeIcon icon="minus-circle" />
          </Button>
        </div>
      </div>
    );
  }
}
