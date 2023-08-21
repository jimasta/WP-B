import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface INovaBaseDoConhecimentoProps {
  Title:string;
  listGuid: string;
  spfxContext: WebPartContext;
  showContent:boolean;
  userDisplayName: string;
}
