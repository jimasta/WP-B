import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import {
  PropertyFieldSPListPicker,
  PropertyFieldSPListPickerOrderBy,
} from "sp-client-custom-fields/lib/PropertyFieldSPListPicker";
import NovaBaseDoConhecimento from "./components/NovaBaseDoConhecimento";
import { INovaBaseDoConhecimentoProps } from "./components/INovaBaseDoConhecimentoProps";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface INovaBaseDoConhecimentoWebPartProps {
  spfxContext: WebPartContext;
  showContent: boolean;
  listGuid: string;
  titleTipos: string;
  titleAbrangencia: string;
}

export default class NovaBaseDoConhecimentoWebPart extends BaseClientSideWebPart<INovaBaseDoConhecimentoWebPartProps> {
  public render(): void {
    const element: React.ReactElement<INovaBaseDoConhecimentoProps> =
      React.createElement(NovaBaseDoConhecimento, {
        listGuid: this.properties.listGuid,
        spfxContext: this.context,
        showContent: this.properties.showContent,
        userDisplayName: this.context.pageContext.user.displayName,
        items: [],
        titleTipos: this.properties.titleTipos || "Tipos de documentos",
        titleAbrangencia: this.properties.titleAbrangencia || "Abrangência",
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description:
              "Webpart responsável pela tabela da nova base de conhecimento.",
          },
          groups: [
            {
              groupName: "Configuraçoes Textuais",
              groupFields: [
                PropertyPaneTextField("titleTipos", {
                  label: "Título do filtro Tipos",
                  description: "Título do filtro Tipos de Documentos",
                  value: this.properties.titleTipos,
                }),
                PropertyPaneTextField("titleAbrangencia", {
                  label: "Título do filtro Abrangência",
                  description: "Título do filtro Abrangência",
                  value: this.properties.titleAbrangencia,
                }),
                /*PropertyPaneTextField("MsgSuccessTitle", {
                  label: "Titulo Modal de Sucesso",
                  description: "*Titulo a ser apresentado no modal de Sucesso",
                  onGetErrorMessage: this.validateDescription.bind(this),
                }),*/
              ],
            },
            {
              groupName: "Configuraçoes de Lista ",
              groupFields: [
                PropertyFieldSPListPicker("listGuid", {
                  label: "Lista Base do Bonhecimento",
                  selectedList: this.properties.listGuid,
                  includeHidden: false,
                  orderBy: PropertyFieldSPListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  render: this.render.bind(this),
                  disableReactivePropertyChanges:
                    this.disableReactivePropertyChanges,
                  properties: this.properties,
                  context: this.context,
                  deferredValidationTime: 0,
                  key: "listPickerFieldId",
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
