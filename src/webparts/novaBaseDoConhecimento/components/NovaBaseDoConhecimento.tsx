import * as React from "react";
import { PrimaryButton, TextField } from "@fluentui/react";
import { DocumentRegular } from "@fluentui/react-icons";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import { INovaBaseDoConhecimentoProps } from "./INovaBaseDoConhecimentoProps";
import "@pnp/sp/items";
import styles from "./NovaBaseDoConhecimento.module.scss";
import {
  TableBody,
  TableCell,
  TableRow,
  Table,
  TableHeader,
  TableHeaderCell,
  TableCellLayout,
} from "@fluentui/react-table";

interface Item {
  id: number;
  title: string;
  grupo: string;
  vigenciaInicio: string;
  vigenciaTermino: string;
}

interface itemTable {
  nomeDocumento: {
    label: string;
    icon: JSX.Element;
  };
  grupo: string;
  vigenciaInicio: string;
  vigenciaTermino: string;
}

interface NovaBaseDoConhecimentoState {
  items: Item[];
  itemTable: itemTable[];
  selectedButtons: Set<string>;
  tiposFiltro: string[];
  searchValue: string | undefined;
}

const columns = [
  { columnKey: "nomeDocumento", label: "Nome do Documento" },
  { columnKey: "grupo", label: "Grupo" },
  { columnKey: "vigenciaInicio", label: "Vigência Início" },
  { columnKey: "vigenciaTermino", label: "Vigência Término" },
];

class NovaBaseDoConhecimento extends React.Component<
  INovaBaseDoConhecimentoProps,
  NovaBaseDoConhecimentoState
> {
  private sp = spfi().using(spSPFx(this.props.spfxContext));

  constructor(props: INovaBaseDoConhecimentoProps) {
    super(props);

    this.state = {
      items: [],
      itemTable: [],
      selectedButtons: new Set(),
      tiposFiltro: [],
      searchValue: "",
    };
  }

  componentDidMount() {
    void this.fetchItems();
  }

  fetchItems = async () => {
    try {
      const allItems: any[] = await this.sp.web.lists
        .getById(this.props.listGuid)
        .items.getAll();
      const arrItems: itemTable[] = allItems.map(
        (item: {
          Id: any;
          Title: any;
          Grupo: any;
          VigenciaInicio: any;
          VigenciaTermino: any;
        }) => ({
          nomeDocumento: { label: item.Title, icon: <DocumentRegular /> },
          grupo: item.Grupo,
          vigenciaInicio: item.VigenciaInicio,
          vigenciaTermino: item.VigenciaTermino,
        })
      );

      const tiposFiltroSet = new Set(arrItems.map((item) => item.grupo));
      const tiposFiltroArray = Array.from(tiposFiltroSet);

      this.setState({ itemTable: arrItems, tiposFiltro: tiposFiltroArray });
    } catch (error) {
      console.log(error);
    }
  };

  handleButtonToggle = (grupo: string) => {
    this.setState((prevState) => {
      const selectedButtons = new Set(prevState.selectedButtons);

      const upperCaseGrupo = grupo.toUpperCase();

      if (selectedButtons.has(upperCaseGrupo)) {
        selectedButtons.delete(upperCaseGrupo);
      } else {
        selectedButtons.add(upperCaseGrupo);
      }

      return { selectedButtons };
    });
  };

  renderFilteredItems = () => {
    const { itemTable, selectedButtons, searchValue } = this.state;

    let filteredItems = itemTable;

    if (selectedButtons.size > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedButtons.has(item.grupo.toUpperCase())
      );
    }

    if (searchValue) {
      filteredItems = filteredItems.filter((item) =>
        item.nomeDocumento.label
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      );
    }

    return filteredItems;
  };

  render() {
    const filteredItems = this.renderFilteredItems();
    const { tiposFiltro, selectedButtons } = this.state;

    return (
      <div className={styles.tableFull}>
        <TextField
          className={styles.textInput}
          placeholder="Pesquise aqui seu documento"
          value={this.state.searchValue}
          onChange={(ev, newValue) => this.setState({ searchValue: newValue })}
        />

        {/* filtros */}
        <div className={styles.filters}>
          <div className={styles.firstFilter}>
            <span className={styles.filterTitles}>{this.props.titleTipos}</span>
            <div className={styles.filtersBtns}>
              {tiposFiltro.map((grupo) => (
                <PrimaryButton
                  key={grupo}
                  className={
                    selectedButtons.has(grupo.toUpperCase())
                      ? styles.btnSelected
                      : styles.btnNotSelected
                  }
                  onClick={() => this.handleButtonToggle(grupo.toUpperCase())}
                >
                  {grupo}
                </PrimaryButton>
              ))}
            </div>
          </div>

          <div className={styles.secondFilter}>
            <span className={styles.filterTitles}>
              {this.props.titleAbrangencia}
            </span>
            <div className={styles.filtersBtns}>
              {/* TODO: deixar dinâmico */}
              <PrimaryButton
                className={
                  selectedButtons.has("FEDERAL")
                    ? styles.btnSelected
                    : styles.btnNotSelected
                }
                onClick={() => this.handleButtonToggle("FEDERAL")}
              >
                FEDERAL
              </PrimaryButton>
              <PrimaryButton
                className={
                  selectedButtons.has("ESTADUAL")
                    ? styles.btnSelected
                    : styles.btnNotSelected
                }
                onClick={() => this.handleButtonToggle("ESTADUAL")}
              >
                ESTADUAL
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* tabela */}
        <Table className={styles.table} arial-label="Nova Base de Conhecimento">
          <TableHeader className={styles.header}>
            <TableRow>
              {columns.map((column) => (
                <TableHeaderCell
                  className={styles.headerCell}
                  key={column.columnKey}
                >
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow
                key={item.nomeDocumento.label}
                className={styles.tableRow}
              >
                <TableCell className={styles.tableCell}>
                  <TableCellLayout media={item.nomeDocumento.icon}>
                    {item.nomeDocumento.label}
                  </TableCellLayout>
                </TableCell>
                <TableCell>
                  <TableCellLayout>{item.grupo}</TableCellLayout>
                </TableCell>
                <TableCell>{item.vigenciaInicio}</TableCell>
                <TableCell>
                  <TableCellLayout>{item.vigenciaTermino}</TableCellLayout>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default NovaBaseDoConhecimento;
