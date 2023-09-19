/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { PrimaryButton, TextField } from "@fluentui/react";
import { DocumentRegular } from "@fluentui/react-icons";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import { INovaBaseDoConhecimentoProps } from "./INovaBaseDoConhecimentoProps";
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

interface IItemTable {
  nomeDocumento: {
    label: string;
    icon: JSX.Element;
  };
  grupo: string;
  vigenciaInicio: string;
  vigenciaTermino: string;
  esfera: string;
  url: string;
  Estado: string[];
}

interface NovaBaseDoConhecimentoState {
  // items: Item[];
  itemTable: IItemTable[];
  selectedGrupo: Set<string>;
  selectedEsferas: Set<string>;
  tiposFiltro: string[];
  searchValue: string | undefined;
  showContent: boolean;
}

const columns = [
  { Key: "nomeDocumento", label: "Nome do Documento", minWidth: 380, maxWidth: 700, isResizable: true },
  { Key: "grupo", label: "Grupo", minWidth: 80, maxWidth: 240, isResizable: true },
  { Key: "Vigente_De", label: "Vigência Início", minWidth: 80, maxWidth: 240, isResizable: true },
  { Key: "Vigente_Ate", label: "Vigência Término", minWidth: 80, maxWidth: 240, isResizable: true },
];

const url = window.location.href;
const urlSemExtensao = url.replace(/\.aspx$/, "");
const partesDaURL = urlSemExtensao.split("/");
//let estadoNaURL = partesDaURL.pop() || ""; // PRD -> urlReal
let estadoNaURL = partesDaURL[6].split(".")[0] //HML -> ?debug
console.log(estadoNaURL);


class NovaBaseDoConhecimento extends React.Component<
  INovaBaseDoConhecimentoProps,
  NovaBaseDoConhecimentoState
> {
  private sp = spfi().using(spSPFx(this.props.spfxContext));

  constructor(props: INovaBaseDoConhecimentoProps) {
    super(props);

    this.state = {
      showContent: false,
      itemTable: [],
      selectedGrupo: new Set(),
      selectedEsferas: new Set(),
      tiposFiltro: [],
      searchValue: "",
    };
  }

  componentDidMount() {
    if (this.props.listGuid) {
      void this.fetchItems();
    }
  }

  fetchItems = async (): Promise<void> => {
    try {
      const allItems: any[] = await this.sp.web.lists
        .getById(this.props.listGuid)
        .items.select(
          "NomeDoc",
          "Grupo",
          "Vigente_De",
          "Vigente_Ate",
          "Esfera",
          "Estado",
          "FileDirRef",
          "FileRef"
        ).filter(`Estado eq '${estadoNaURL}' or Estado eq 'Todas as UFs'`).top(5000)();

      console.log(allItems);



      const itensEstado = allItems.filter((item: IItemTable) => {
        return item.Estado
      });

      const arrItems: IItemTable[] = itensEstado.map((item) => {
        return {
          nomeDocumento: {
            label: item.NomeDoc,
            icon: <DocumentRegular className={styles.svgIcon} />,
          },
          grupo: item.Grupo,
          vigenciaInicio: item.Vigente_De,
          vigenciaTermino: item.Vigente_Ate,
          esfera: item.Esfera,
          url: item.FileRef,
          Estado: item.Estado,
        };
      });

      const tiposFiltroSet = new Set(arrItems.map((item) => item.grupo));
      const tiposFiltroArray = Array.from(tiposFiltroSet);

      this.setState({ itemTable: arrItems, tiposFiltro: tiposFiltroArray });
    } catch (error) {
      console.log(error);
    }
  };

  handleGrupo = (grupo: string) => {
    this.setState((prevState) => {
      const selectedGrupo = new Set<string>();

      if (prevState.selectedGrupo.has(grupo.toUpperCase())) {
        return { selectedGrupo };
      }

      selectedGrupo.add(grupo.toUpperCase());

      return { selectedGrupo };
    });
  };

  handleAbrangencia = (abrangencia: string) => {
    this.setState((prevState) => {
      const selectedEsferas = new Set<string>();

      if (prevState.selectedEsferas.has(abrangencia.toUpperCase())) {
        return { selectedEsferas };
      }

      selectedEsferas.add(abrangencia.toUpperCase());

      return { selectedEsferas };
    });
  };

  renderFilteredItems = () => {
    const { itemTable, selectedGrupo, selectedEsferas, searchValue } =
      this.state;

    let filteredItems = itemTable;

    if (selectedGrupo.size > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedGrupo.has(item.grupo.toUpperCase())
      );
    }
    if (selectedEsferas.size > 0) {
      filteredItems = filteredItems.filter((item) =>
        selectedEsferas.has(item.esfera.toUpperCase())
      );
    }

    if (searchValue) {
      filteredItems = filteredItems.filter((item) => {
        if (item.nomeDocumento.label !== null) {
          return item.nomeDocumento.label
            .toLowerCase()
            .includes(searchValue.toLowerCase());
        }
        return false;
      });
    }

    return filteredItems;
  };

  openDocument(url: string) {
    const documentUrl = `${url}`;
    window.open(documentUrl, "_blank");
  }

  render() {
    const filteredItems = this.renderFilteredItems();
    const { tiposFiltro, selectedGrupo, selectedEsferas } = this.state;

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
                    selectedGrupo.has(grupo.toUpperCase())
                      ? styles.btnSelected
                      : styles.btnNotSelected
                  }
                  onClick={() => this.handleGrupo(grupo.toUpperCase())}
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
              <PrimaryButton
                className={
                  selectedEsferas.has("FEDERAL")
                    ? styles.btnSelected
                    : styles.btnNotSelected
                }
                onClick={() => this.handleAbrangencia("FEDERAL")}
              >
                FEDERAL
              </PrimaryButton>
              <PrimaryButton
                className={
                  selectedEsferas.has("ESTADUAL")
                    ? styles.btnSelected
                    : styles.btnNotSelected
                }
                onClick={() => this.handleAbrangencia("ESTADUAL")}
              >
                ESTADUAL
              </PrimaryButton>
            </div>
          </div>
        </div>

        {/* tabela */}
        <Table className={styles.table} arial-label="Nova Base de Conhecimento">
          <TableHeader className={styles.header}>
            <TableRow className={styles.tableRow}>
              {columns.map((column) => (
                <TableHeaderCell
                  className={column.Key === 'nomeDocumento' ? `${styles.firstColumn} ${styles.headerCell}` : styles.headerCell}
                  key={column.Key}>
                  {column.label}
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={styles.tableBody}>
            {filteredItems.map((item) => (
              <TableRow
                onClick={() => this.openDocument(item.url)}
                key={item.nomeDocumento.label}
                className={`${styles.tableRow}`}>
                <TableCell className={`${styles.tableCell} ${styles.firstColumn}`}>
                  <TableCellLayout media={item.nomeDocumento.icon}>
                    {item.nomeDocumento.label || "Sem título"}
                  </TableCellLayout>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <TableCellLayout>{item.grupo}</TableCellLayout>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {item.vigenciaInicio}
                </TableCell>
                <TableCell className={styles.tableCell}>
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
