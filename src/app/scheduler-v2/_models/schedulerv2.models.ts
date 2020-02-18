export class SchedulerParams{

  get = (obj: any, ...props: string[]): any => {
  return obj && props.reduce(
    (result, prop) => result == null ? undefined : result[prop],
    obj
  );
}

  // Text displayed at the top left corner of the table, over all rows
  crossHeaderText?: string;

  constructor(params?: SchedulerParams) {
    this.crossHeaderText = this.get(params, 'crossHeaderText') ? params.crossHeaderText : 'Users'
  }
}