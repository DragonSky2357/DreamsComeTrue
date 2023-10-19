import "../css/Mainboard.css";
import BasicMasonry from "./BasicMasonry";

const Mainboard = (props: any) => {
  let { post } = props;

  return <BasicMasonry post={post} />;
};

export default Mainboard;
