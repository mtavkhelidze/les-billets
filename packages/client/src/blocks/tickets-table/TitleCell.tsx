interface Props {
  key: string;
  title: string;
}

export const TitleCell = (props: Props) => {
  return (
    <th key={key}>
      <span key={props.key} className="font-bold">{props.title}</span>
    </th>
  );
};
