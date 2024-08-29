export type RuleProps = {
    text: string,
    icon: () => JSX.Element, 
}

export type PrizeProps = {
      title: string,
      /** Описание в открытой карточке */
      decription: string,
      /** Сколько звёздочек надо добыть */
      cost: number,
       /** Сколько осталось таких призов */
      left: number,
      /** Путь до картинки */
      pic?: string 
    }
  