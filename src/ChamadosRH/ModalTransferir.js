import React, { Component } from "react";
import "../css/PageChamado.css";
import { Modal, Col, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../APIs/DataApi";
import { toast } from 'react-toastify';
import { Typeahead } from "react-bootstrap-typeahead"
import 'react-bootstrap-typeahead/css/Typeahead.css';

export class ModalTransferir extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      modalName: props.modalName,
      setores: [],
      prioridades: [],
      transf: { formulario: props.numChamado }
    };
    this.openModal = this.openModal.bind(this);
    this.handleTransferencia = this.handleTransferencia.bind(this);
  }

  handleTransferencia() {
    api("api/Redirecionar", {
      method: "post",
      headers: { "Content-Type": "application/json;" },
      body: JSON.stringify(this.state.transf)
    })
      .then(
        resp => {
          if (resp.status == 200)
            return resp.json()
          else
            throw resp.json();
        }
      )
      .then(data =>
        toast.success(
          data.message
        )
      )
      .catch(
        a => a.then(e =>
          toast.error(
            e.message,
            {
              position: toast.POSITION.TOP_CENTER
            }
          )
        )
      );
  }

  componentDidUpdate(prevProps) {
    if (this.props.show !== prevProps.show) {
      this.setState({ show: this.props.show });
    }
  }

  openModal() {
    api("api/redirecionar", {})
      .then(r => r.json())
      .then(rj =>
        this.setState({ prioridades: rj.prioridades, setores: rj.setores })
      );
  }

  render() {
    return (
      <Modal
        size="lg"
        show={this.state.show}
        onHide={() => this.props.close(this.state.modalName)}
        onEnter={this.openModal}
        aria-labelledby=""
      >
        <Modal.Header closeButton>
          <Modal.Title id="">
            Transferir Chamado {this.props.protocolo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Transferir para:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={evt =>
                    this.setState({
                      transf: {
                        ...this.state.transf,
                        setores: evt.target.value
                      }
                    })
                  }
                >
                  <option value="0">Selecione uma Secretaria</option>;
                  {this.state.setores.map(function (a, i) {
                    return <option value={a.id}>{a.value}</option>;
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Prioridade:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={evt =>
                    this.setState({
                      transf: {
                        ...this.state.transf,
                        prioridades: evt.target.value
                      }
                    })
                  }
                >
                  <option value="0">Selecione uma Prioridade</option>;
                  {this.state.prioridades.map(function (a, i) {
                    return <option value={a.id}>{a.value}</option>;
                  })}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group>
              <Form.Label>Descrição:</Form.Label>
              <Form.Control
                as="textarea"
                rows="3"
                onChange={evt =>
                  this.setState({
                    transf: {
                      ...this.state.transf,
                      descricao: evt.target.value
                    }
                  })
                }
              />
            </Form.Group>
            <Link to="/chamados">
              <Button variant="primary" onClick={this.handleTransferencia}>
                Transferir
              </Button>
            </Link>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
