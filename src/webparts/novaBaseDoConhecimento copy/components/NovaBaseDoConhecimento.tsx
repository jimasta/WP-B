import * as React from 'react';
import styles from './NovaBaseDoConhecimento.module.scss';
import { INovaBaseDoConhecimentoProps } from './INovaBaseDoConhecimentoProps';
import { spfi, SPFx as spSPFx } from '@pnp/sp';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";

interface ItemList {
  A: any;
}


export default class NovaBaseDoConhecimento extends React.Component<INovaBaseDoConhecimentoProps, {
  MyItens: any[]; 
   ShowContent: boolean,}> {

  sp = spfi().using(spSPFx(this.props.spfxContext));

  constructor(props: any) {
    super(props);
    this.state = {
      ShowContent: false,
      MyItens: [],

    };
  };

  public Exemplo = () => {
    const arrItems: any[] = [];
    /*Mano deixei aqui uma chamadinha pronta de um exemplo como voce pode buscar os dados ja pegando a lista selecinada no painel de propiedades que ja esta OK */
    this.sp.web.lists.getById(this.props.listGuid).items()
      .then(res => {
        res.map(async (item: any) => {
          let ItemResult: ItemList = {
            A: <div>item.Title</div>

          }
          arrItems.push(ItemResult);
        })
        this.setState({ MyItens: arrItems })
      })
      .catch(err => {
        console.log(err);
      });
  };


  public render(): React.ReactElement<INovaBaseDoConhecimentoProps> {


    return (
      <section className={styles.novaBaseDoConhecimento}>
        <h2>{this.props.Title}</h2>
        <p>Eae {this.props.userDisplayName}, acredito que daqui voçe consegue seguir !!!</p>
        {this.state.MyItens}
      </section>
    );
  }
}
