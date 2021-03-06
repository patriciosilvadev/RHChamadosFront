import React, { Component } from "react";
import "../css/bootstrap.css";
import Chamado from "./Chamado.js";
import "../css/Chamados.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "react-bootstrap";
import Cabecalho from "./Cabecalho";
import "../css/Cabecalho.css";
import ReactPaginate from "react-paginate";
import "../css/pagination.css";
import api from "../APIs/DataApi";
const removeAcentos = require("remove-accents");

class TabelaIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tipo: this.props.match.params.tipo,
      filters: {},
      all: [],
      filtered: null,
      current: 0,
      private: true,
      anexoFile: File
    };
    this.handleFiltering = this.handleFiltering.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  handleFiltering(a) {
    let newFilter = this.state.filters;
    newFilter[a.propertie] = a.value;

    this.setState({
      current: 0,
      filters: newFilter,
    });
  }

  getFiltered = () => {

    const newFilter = this.state.filters;

    var checkFilter = function (element) {
      let retorno = true;
      Object.keys(newFilter).forEach(function (p, i) {
        if (!isNaN(element[p])) {
          if (
            newFilter[p] !== "" &&
            !removeAcentos(element[p].toString()).includes(
              newFilter[p].toString()
            )
          ) {
            retorno = false;
            return false;
          }
        } else if (
          newFilter[p] !== "" &&
          !removeAcentos(element[p].toLowerCase()).includes(newFilter[p])
        ) {
          retorno = false;
          return false;
        }
      });
      return retorno;
    };

    let newDems = this.state.all.filter(function (a, i) {
      return checkFilter(a);
    });

    return newDems;

  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.tipo !== this.props.match.params.tipo) {
      this.setState({all:[], ready:false})
      this.fetchdata();
    }
  }

  fetchdata = (lastId) => {

    const tipo = this.props.match.params.tipo

    api("api/values?tipo=" + tipo+"&lastId="+(lastId||0), {})
      .then(response => response.json())
      .then(data => {
        data.lista
          .filter(a => {
            return !a.protocolo;
          })
          .forEach(b => {
            b.protocolo = "A" + b.numChamado;
          });
        
          if(this.props.match.params.tipo == tipo)
          {
          this.addReceivedData(data.lista);

          if(data.lista.length > 0)
          this.fetchdata(Math.min(...data.lista.map(item => item.numChamado)))

          this.setState({ready: true})
          }

      });
  };

  addReceivedData = (data) => {

    console.log('dados recebidos = ', data)
    let currentData = [...this.state.all];
    currentData = [...currentData, ...data];

    this.setState({
      all: currentData,
      current: 0
    });

  }

  // BuscarNovo() {
  //   api("api/values", {})
  //     .then(response => response.json())
  //     .then(data => this.setState({ dems: [...this.state.dems, data.lista] }));
  // }

  handlePageClick(a) {
    this.setState({ current: a.selected });
  }

  componentDidMount() {
    this.fetchdata();
  }

  render() {
    const filteredElements = this.getFiltered();

    let filterObj = this.state.filters;
    let _this = this;
    var checkFilter = function (element) {
      for (var p in Object.keys(filterObj)) {
        if (filterObj[p] !== "" && element[p] !== filterObj[p]) return false;
      }

      return true;
    };

    function calcNumPages() {
      let filtered = filteredElements;

      return Math.floor(
        filtered.length % 10 > 0
          ? filtered.length / 10 + 1
          : filtered.length / 10
      );
    }

    function getPageDems() {
      let { current, filtered } = _this.state;
      return filteredElements.slice(current * 10, current * 10 + 10);
    }

    if (!this.state.ready)
      return (
        <div className="carregando">
          <FontAwesomeIcon icon="spinner" pulse />
        </div>
      );
    else {
      const numPages = calcNumPages();
      return (
        <div className="container-app">
          <Table striped bordered hover className="cabecalho">
            <thead>
              <tr>
                <th>
                  <Cabecalho
                    label="Protocolo"
                    icone="list-ol"
                    FilterParam="protocolo"
                    sizeInput="w-25"
                    onFilter={this.handleFiltering}
                  />
                </th>
                <th>
                  <Cabecalho
                    label="Solicitante"
                    icone="user"
                    FilterParam="solicitante"
                    sizeInput="w-75"
                    onFilter={this.handleFiltering}
                  />
                </th>
                <th>
                  <Cabecalho
                    label="CPF"
                    icone="hashtag"
                    FilterParam="cpf"
                    sizeInput="w-75"
                    onFilter={this.handleFiltering}
                  />
                </th>
                <th>
                  <Cabecalho
                    label="Assunto"
                    icone="comment-dots"
                    FilterParam="assunto"
                    sizeInput="w-75"
                    onFilter={this.handleFiltering}
                  />
                </th>
                <th>
                  <Cabecalho
                    label="Abertura"
                    icone="calendar-day"
                    FilterParam="data"
                    sizeInput="w-50"
                    onFilter={this.handleFiltering}
                  />
                </th>
                <th>
                  <Cabecalho
                    label="Setor Abertura"
                    icone=""
                    FilterParam="setorAbertura"
                    sizeInput="w-50"
                    onFilter={this.handleFiltering}
                  />
                </th>
                {this.props.match.params.tipo == "TodosAtendimento" ||
                  this.props.match.params.tipo == "TodosFechados" ? (
                    <th>
                      <Cabecalho
                        label="Setor"
                        icone="building"
                        FilterParam="setor"
                        sizeInput="w-75"
                        onFilter={this.handleFiltering}
                      />
                    </th>
                  ) : (
                    <th>
                      <Cabecalho
                        label="Atribuído a"
                        icone="user"
                        FilterParam="atendenteResponsavel"
                        sizeInput="w-75"
                        onFilter={this.handleFiltering}
                      />
                    </th>
                  )}
              </tr>
            </thead>
            <tbody>
              {getPageDems().map(function (a, i) {
                return (
                  <Chamado
                    tag={a.tag === undefined ? null : a.tag}
                    numChamado={a.numChamado}
                    solicitante={a.solicitante}
                    assunto={a.assunto}
                    data={a.data}
                    status={a.status}
                    prioridade={a.prioridade}
                    masp={a.masp}
                    cpf={a.cpf
                      .replace(/[^a-z0-9]/gi, "")
                      .replace(
                        /(\d{3})?(\d{3})?(\d{3})?(\d{2})/,
                        "$1.$2.$3-$4"
                      )}
                    desc={a.desc}
                    email={a.email}
                    cel={a.cel}
                    setor={a.setor}
                    setorAbertura={a.setorAbertura}
                    prazo={a.prazo}
                    anexoFile={_this.handleFile}
                    justificativa={a.justificativa}
                    IsAutenticado={a.isAutenticado}
                    atendenteResponsavel={a.atendenteResponsavel}
                    protocolo={a.protocolo}
                    alterAssunto={a.alterAssunto}
                    SetorOrSolicitante={
                      _this.props.match.params.tipo == "TodosAtendimento" ||
                      _this.props.match.params.tipo == "TodosFechados"
                    }
                    isReturn={a.isReturn}
                  />
                );
              })}
            </tbody>
          </Table>
          <ReactPaginate
            key={"paginator" + numPages}
            previousLabel={"<"}
            nextLabel={">"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={numPages}
            forcePage={0}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      );
    }
  }
}
export default TabelaIndex;