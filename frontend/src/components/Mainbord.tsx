import "../css/Mainboard.css";
import BasicMasonry from "./basicMasonry";

const Mainboard = (props: any) => {
  let { post } = props;

  return <BasicMasonry post={post} />;
};

export default Mainboard;
