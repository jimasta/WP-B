import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import {
  BaseClientSideWebPart,
  WebPartContext,
} from "@microsoft/sp-webpart-base";
import {
  PropertyFieldSPListPicker,
  PropertyFieldSPListPickerOrderBy,
} from "sp-client-custom-fields/lib/PropertyFieldSPListPicker";
import NovaBaseDoConhecimento from "./components/NovaBaseDoConhecimento";
import { INovaBaseDoConhecimentoProps } from "./components/INovaBaseDoConhecimentoProps";

export interface INovaBaseDoConhecimentoWebPartProps {
  Title: string;
  listGuid: string;
  spfxContext: WebPartContext;
  showContent: boolean;
}

export default class NovaBaseDoConhecimentoWebPart2 extends BaseClientSideWebPart<INovaBaseDoConhecimentoWebPartProps> {
  public render(): void {
    const element: React.ReactElement<INovaBaseDoConhecimentoProps> =
      React.createElement(NovaBaseDoConhecimento, {
        Title: this.properties.Title,
        listGuid: this.properties.listGuid,
        spfxContext: this.context,
        showContent: this.properties.showContent,
        userDisplayName: this.context.pageContext.user.displayName,
      });

    ReactDom.render(element, this.domElement);
  }

  /* protected onInit(): Promise<void> {

  }*/

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
            description: "",
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Configuraçoes Textuais",
              groupFields: [
                PropertyPaneTextField("Title", {
                  label: "Titulo",
                  description: "*Titulo a ser exibido na Webpart",
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
                  label: "Lista Base do Conhecimento",
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
