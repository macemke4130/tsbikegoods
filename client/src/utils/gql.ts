export const gql = async (ask: any) => {
  let query = ask;
  let method = "POST";
  let headers = { "Content-Type": "application/json", Accept: "application/json" };
  let body = JSON.stringify({ query });

  //   const graphqlPath = "./graphql";
  const graphqlPath = "http://localhost:3001/graphql";

  try {
    const r: any = await fetch(graphqlPath, { method, headers, body });
    const JSONData = await r.json();
    return JSONData.data;
  } catch (e) {
    console.error(e);
  }
};
