async function getData() {
  const res = await fetch("http://localhost:8000");

  return res;
}

export default async function FristPost() {
  const data = await getData();

  return <h1>{data.body}</h1>;
}
