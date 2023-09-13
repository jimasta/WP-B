import * as React from "react";
import {
  DetailsList,
  IColumn,
  DetailsListLayoutMode,
  SelectionMode,
  TextField,
} from "@fluentui/react";

export interface INovaBaseDoConhecimentoTableProps {
  items: any[]; // Seus itens de dados
}

export interface INovaBaseDoConhecimentoTableState {
  filteredItems: any[]; // Itens após aplicar o filtro
}

export default class NovaBaseDoConhecimentoTable extends React.Component<
  INovaBaseDoConhecimentoTableProps,
  INovaBaseDoConhecimentoTableState
> {
  constructor(props: INovaBaseDoConhecimentoTableProps) {
    super(props);

    this.state = {
      filteredItems: props.items, // Começa com todos os itens
    };
  }

  handleFilter = (filterText: string | undefined) => {
    if (filterText !== undefined) {
      const filteredItems = this.props.items.filter(
        (item) =>
          item.someField.toLowerCase().indexOf(filterText.toLowerCase()) > -1
      );

      this.setState({ filteredItems });
    }
  };

  public render(): React.ReactElement<INovaBaseDoConhecimentoTableProps> {
    const columns: IColumn[] = [
      {
        key: "column1",
        name: "Coluna 1",
        fieldName: "someField",
        minWidth: 100,
        maxWidth: 600, 
      },
      // Adicione mais colunas conforme necessário
    ];

    return (
      <div>
        <TextField
          label="Filtrar"
          onChange={(event, newValue) => this.handleFilter(newValue)}
        />
        <DetailsList
          items={this.state.filteredItems}
          columns={columns}
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
      </div>
    );
  }
}
